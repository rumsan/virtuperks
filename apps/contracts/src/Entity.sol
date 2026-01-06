// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interfaces/IEntity.sol";
import "./interfaces/ITaskManagement.sol";
import "./interfaces/IParticipantManagement.sol";

contract Entity is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    ReentrancyGuardUpgradeable,
    IEntity,
    ITaskManagement,
    IParticipantManagement
{
    using SafeERC20 for IERC20;

    // =============================================================
    // ======================= STORAGE ==============================
    // =============================================================

    /// @notice Entity metadata (renamed from `Entity` to avoid collision)
    EntityInfo private entityInfo;

    /// @notice App (factory / controller) contract
    address private appContract;

    mapping(bytes32 => Task) private tasks;
    mapping(bytes32 => mapping(address => TaskAssignment)) public taskAssignments;
    mapping(bytes32 => mapping(address => bool)) public whitelistedParticipants;
    mapping(bytes32 => mapping(address => bool)) public isParticipant;
    mapping(bytes32 => address[]) public approvedParticipants;
    mapping(bytes32 => address[]) public acceptedParticipants;
    bytes32[] private taskIds;

    /// @notice Token allocation tracking per token type
    mapping(address => uint256) public totalAllocatedTokens;

    /// @notice Emergency pause
    bool public paused;

    /// @notice Global shutdown switch: when true, allocations are considered void and full balance can be withdrawn
    bool public allocationsFrozen;

    /// @notice Storage gap for future upgrades
    uint256[50] private __gap;

    // =============================================================
    // ======================= MODIFIERS ============================
    // =============================================================

    modifier onlyTaskOwner(bytes32 taskId) {
        require(tasks[taskId].owner == msg.sender, "Entity: Not task owner");
        _;
    }

    modifier taskExists(bytes32 taskId) {
        require(tasks[taskId].owner != address(0), "Entity: Task does not exist");
        _;
    }

    modifier onlyAppContract() {
        require(msg.sender == appContract, "Entity: Only app contract");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Entity: paused");
        _;
    }

    modifier entityActive() {
        require(entityInfo.isActive, "Entity: inactive");
        _;
    }

    // =============================================================
    // ======================= INITIALIZATION =======================
    // =============================================================

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _appContract,
        address entityOwner,
        string memory name,
        string memory url
    ) external initializer {
        require(_appContract != address(0), "Entity: Invalid app contract");
        require(entityOwner != address(0), "Entity: Invalid owner");
        require(bytes(name).length > 0, "Entity: Name cannot be empty");

        __Ownable_init(entityOwner);
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();

        entityInfo = EntityInfo({
            name: name,
            url: url,
            owner: entityOwner,
            isActive: true
        });

        appContract = _appContract;
        paused = false;
        allocationsFrozen = false;

        emit EntityInitialized(entityOwner, name);
    }

    // =============================================================
    // ======================= UPGRADE AUTH =========================
    // =============================================================

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {
        emit EntityUpgraded(newImplementation);
    }

    // =============================================================
    // ======================= ADMIN ================================
    // =============================================================

    function pause() external onlyOwner {
        paused = true;
    }

    function unpause() external onlyOwner {
        paused = false;
    }

    /// @notice Allows governance to update App contract if needed
    function updateAppContract(address newApp) external onlyOwner {
        require(newApp != address(0), "Entity: invalid app");
        address old = appContract;
        appContract = newApp;
        emit AppContractUpdated(old, newApp);
    }

    /// @notice Permanently deactivates the entity and freezes all allocations.
    /// @dev This is a one-way operation intended for final shutdown & migration.
    function deactivateEntity() external onlyOwner {
        require(entityInfo.isActive, "Entity: already inactive");

        // Mark entity inactive
        entityInfo.isActive = false;

        // Freeze all allocations permanently
        allocationsFrozen = true;

        emit EntityDeactivated(msg.sender);
        emit AllocationsFrozen(msg.sender);
    }

    // =============================================================
    // ======================= VIEW FUNCTIONS =======================
    // =============================================================

    function getEntityInfo() external view override returns (EntityInfo memory) {
        return entityInfo;
    }

    function getUnallocatedTokens(address token) external view returns (uint256) {
        require(token != address(0), "Entity: Invalid token");

        uint256 balance = IERC20(token).balanceOf(address(this));

        // If allocations are frozen, we consider everything withdrawable/unallocated.
        if (allocationsFrozen) return balance;

        uint256 allocated = totalAllocatedTokens[token];
        if (balance <= allocated) return 0;
        return balance - allocated;
    }

    function getTotalAllocatedTokens(address token) external view returns (uint256) {
        require(token != address(0), "Entity: Invalid token");
        return totalAllocatedTokens[token];
    }

    // =============================================================
    // ======================= WITHDRAWALS ==========================
    // =============================================================

    /// @notice Withdraw only unallocated tokens (safe path).
    /// @dev Allowed only when deactivated. If allocationsFrozen=true, "unallocated" = full balance.
    function withdrawUnallocatedTokens(address token, address to, uint256 amount)
        external
        onlyOwner
    {
        require(!entityInfo.isActive, "Entity: must be deactivated");
        require(token != address(0), "Entity: invalid token");
        require(to != address(0), "Entity: invalid recipient");
        require(amount > 0, "Entity: amount must be > 0");

        uint256 balance = IERC20(token).balanceOf(address(this));

        uint256 withdrawable;
        if (allocationsFrozen) {
            withdrawable = balance;
        } else {
            uint256 allocated = totalAllocatedTokens[token];
            require(balance > allocated, "Entity: no withdrawable balance");
            withdrawable = balance - allocated;
        }

        require(amount <= withdrawable, "Entity: amount exceeds withdrawable");

        IERC20(token).safeTransfer(to, amount);
        emit TokensWithdrawn(token, to, amount, msg.sender);
    }

    /// @notice Withdraw the entire remaining balance after entity deactivation.
    function emergencyWithdrawAll(address token, address to)
        external
        onlyOwner
    {
        require(!entityInfo.isActive, "Entity: must be deactivated");
        require(allocationsFrozen, "Entity: allocations not frozen");
        require(token != address(0), "Entity: invalid token");
        require(to != address(0), "Entity: invalid recipient");

        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "Entity: no balance");

        IERC20(token).safeTransfer(to, balance);
        emit EmergencyWithdrawal(token, to, balance, msg.sender);
    }

    function withdrawETH(address payable to) external onlyOwner {
        require(to != address(0), "invalid recipient");
        uint256 bal = address(this).balance;
        require(bal > 0, "no ETH");
        (bool ok, ) = to.call{value: bal}("");
        require(ok, "ETH transfer failed");
    }

    /**
     * @dev Reverts if ETH is sent to this contract
     */
    receive() external payable {
        revert("NoEthReception: ETH not accepted");
    }

    /**
     * @dev Reverts if ETH is sent to this contract via fallback
     */
    fallback() external payable {
        revert("NoEthReception: ETH not accepted");
    }

    // =============================================================
    // ======================= TOKEN FLOW ===========================
    // =============================================================

    function depositTokens(
        address token,
        uint256 amount
    ) external override nonReentrant whenNotPaused entityActive {
        require(!allocationsFrozen, "Entity: allocations frozen");
        require(token != address(0), "Entity: Invalid token");
        require(amount > 0, "Entity: Amount must be greater than 0");

        uint256 beforeBal = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        uint256 received = IERC20(token).balanceOf(address(this)) - beforeBal;

        require(received == amount, "Entity: fee-on-transfer not supported");

        emit TokensDeposited(token, amount, msg.sender);
    }

    function distributeRewards(bytes32 taskId)
        external
        override
        nonReentrant
        onlyTaskOwner(taskId)
        taskExists(taskId)
        whenNotPaused
        entityActive
    {
        Task storage task = tasks[taskId];

        require(!task.isTokenDisbursed, "Entity: already distributed");
        require(approvedParticipants[taskId].length > 0, "Entity: no participants");
        require(!task.isOpen || isTaskExpired(taskId), "Entity: task still open");

        uint256 count = approvedParticipants[taskId].length;
        uint256 total = task.totalRewardAmount;

        uint256 baseReward = total / count;
        uint256 remainder  = total % count;

        IERC20 token = IERC20(task.rewardToken);

        for (uint256 i = 0; i < count; i++) {
            uint256 payout = baseReward;

            // 🔑 last participant gets the remainder
            if (i == count - 1) {
                payout += remainder;
            }

            address participant = approvedParticipants[taskId][i];
            taskAssignments[taskId][participant].status = AssignmentStatus.DISBURSED;
            token.safeTransfer(participant, payout);
        }

        task.isTokenDisbursed = true;

        uint256 allocated = totalAllocatedTokens[task.rewardToken];
        require(allocated >= total, "Entity: allocation mismatch");
        totalAllocatedTokens[task.rewardToken] = allocated - total;

        emit RewardsDistributed(taskId, total, count);
    }

    // =============================================================
    // ======================= INTERNAL =============================
    // =============================================================

    function _acceptParticipantInternal(bytes32 taskId, address participant) private {
        taskAssignments[taskId][participant].status = AssignmentStatus.ACCEPTED;
        tasks[taskId].acceptedParticipantCount++;
        acceptedParticipants[taskId].push(participant);
        emit TaskAssignmentAccepted(taskId, participant);
    }


    function _canAllocateTokens(address token, uint256 amount)
        private
        view
        returns (bool)
    {
        if (allocationsFrozen) return false;

        uint256 balance = IERC20(token).balanceOf(address(this));
        uint256 allocated = totalAllocatedTokens[token];

        if (balance <= allocated) return false;
        return amount <= (balance - allocated);
    }

    // =============================================================
    // ======================= TASK MANAGEMENT ======================
    // =============================================================

    function createTask(
        bytes32 taskId,
        Task memory task,
        address[] memory whitelist
    ) external override onlyOwner whenNotPaused entityActive {
        require(!allocationsFrozen, "Entity: allocations frozen");
        require(taskId != bytes32(0), "Entity: Invalid task ID");
        require(tasks[taskId].owner == address(0), "Entity: Task exists");
        require(task.expiryDate > block.timestamp, "Entity: Invalid expiry");
        require(task.rewardToken != address(0), "Entity: Invalid token");
        require(task.totalRewardAmount > 0, "Entity: Invalid reward");
        require(task.maxParticipants > 0, "Entity: Invalid max");

        require(
            _canAllocateTokens(task.rewardToken, task.totalRewardAmount),
            "Entity: Insufficient unallocated tokens"
        );

        task.owner = task.owner == address(0) ? msg.sender : task.owner;
        task.isOpen = true;
        task.acceptedParticipantCount = 0;
        task.isTokenDisbursed = false;

        tasks[taskId] = task;
        taskIds.push(taskId);
        totalAllocatedTokens[task.rewardToken] += task.totalRewardAmount;

        for (uint256 i = 0; i < whitelist.length; i++) {
            addToWhitelist(taskId, whitelist[i], false);
        }

        emit TaskCreated(taskId, msg.sender);
    }

    function closeTask(bytes32 taskId)
        external
        override
        onlyTaskOwner(taskId)
        taskExists(taskId)
        whenNotPaused
        entityActive
    {
        Task storage task = tasks[taskId];

        require(task.isOpen, "Entity: Task already closed");

        task.isOpen = false;

        emit TaskClosed(taskId, msg.sender);
    }

    function isTaskExpired(bytes32 taskId) public view override taskExists(taskId) returns (bool) {
        return block.timestamp > tasks[taskId].expiryDate;
    }

    function isTaskOpen(bytes32 taskId) public view override taskExists(taskId) returns (bool) {
        return tasks[taskId].isOpen && !isTaskExpired(taskId);
    }

    function isMaxParticipantsReached(bytes32 taskId) public view override taskExists(taskId) returns (bool) {
        return tasks[taskId].acceptedParticipantCount >= tasks[taskId].maxParticipants;
    }

    function updateTaskDetails(
        bytes32 taskId,
        string memory newDetailsUrl,
        uint256 newExpiryDate
    ) external override onlyTaskOwner(taskId) taskExists(taskId) whenNotPaused entityActive {
        require(tasks[taskId].isOpen, "Entity: Task is closed");
        require(newExpiryDate > block.timestamp, "Entity: Invalid expiry date");

        tasks[taskId].detailsUrl = newDetailsUrl;
        tasks[taskId].expiryDate = newExpiryDate;

        emit TaskDetailsUpdated(taskId, msg.sender);
    }

    function getTask(bytes32 taskId) external view taskExists(taskId) returns (Task memory) {
        return tasks[taskId];
    }

    function getAllTasks() external view returns (bytes32[] memory) {
        return taskIds;
    }

    // =============================================================
    // ======================= PARTICIPANT MANAGEMENT ===============
    // =============================================================

    function addToWhitelist(
        bytes32 taskId,
        address participant,
        bool throwError
    ) public override taskExists(taskId) whenNotPaused entityActive {
        require(!allocationsFrozen, "Entity: allocations frozen");
        require(
            msg.sender == owner() || msg.sender == tasks[taskId].owner || msg.sender == address(this),
            "Entity: Not authorized"
        );
        require(participant != address(0), "Entity: Invalid participant");

        if (whitelistedParticipants[taskId][participant]) {
            if (throwError) revert("Entity: Participant already whitelisted");
            return;
        }

        whitelistedParticipants[taskId][participant] = true;
        emit ParticipantWhitelisted(taskId, participant, msg.sender);
    }

    function removeFromWhitelist(
        bytes32 taskId,
        address participant
    ) external override onlyTaskOwner(taskId) taskExists(taskId) whenNotPaused entityActive {
        require(!allocationsFrozen, "Entity: allocations frozen");
        require(whitelistedParticipants[taskId][participant], "Entity: Participant not whitelisted");

        whitelistedParticipants[taskId][participant] = false;
        emit ParticipantRemovedFromWhitelist(taskId, participant, msg.sender);
    }

    function participate(bytes32 taskId)
        external
        override
        taskExists(taskId)
        whenNotPaused
        entityActive
    {
        require(!allocationsFrozen, "Entity: allocations frozen");
        require(isTaskOpen(taskId), "Entity: Task is not open");
        require(!isMaxParticipantsReached(taskId), "Entity: Max participants reached");
        require(taskAssignments[taskId][msg.sender].status == AssignmentStatus.NONE, "Entity: Already participating");

        Task storage task = tasks[taskId];

        if (task.isWhitelisted) {
            require(whitelistedParticipants[taskId][msg.sender], "Entity: Participant is not whitelisted");
        }

        AssignmentStatus initialStatus = task.requireApproval
            ? AssignmentStatus.PENDING
            : AssignmentStatus.ACCEPTED;

        taskAssignments[taskId][msg.sender] = TaskAssignment({
            status: initialStatus,
            completionUrl: ""
        });

        isParticipant[taskId][msg.sender] = true;

        if (initialStatus == AssignmentStatus.ACCEPTED) {
            task.acceptedParticipantCount++;
            acceptedParticipants[taskId].push(msg.sender);
            emit TaskAssignmentAccepted(taskId, msg.sender);
        }

        emit TaskAssignmentApplied(taskId, msg.sender);
    }

    function acceptParticipant(
        bytes32 taskId,
        address participant
    ) external override onlyTaskOwner(taskId) taskExists(taskId) whenNotPaused entityActive {
        require(!allocationsFrozen, "Entity: allocations frozen");
        require(taskAssignments[taskId][participant].status == AssignmentStatus.PENDING, "Entity: Invalid assignment status");
        require(!isMaxParticipantsReached(taskId), "Entity: Max participants reached");

        _acceptParticipantInternal(taskId, participant);
    }

    function completeTask(
        bytes32 taskId,
        string memory completionUrl
    ) external override taskExists(taskId) whenNotPaused entityActive {
        require(!allocationsFrozen, "Entity: allocations frozen");
        require(!isTaskExpired(taskId), "Entity: Task has expired");
        require(bytes(completionUrl).length > 0, "Entity: Completion URL cannot be empty");

        Task storage task = tasks[taskId];
        AssignmentStatus currentStatus = taskAssignments[taskId][msg.sender].status;

        if (task.isWhitelisted) {
            require(whitelistedParticipants[taskId][msg.sender], "Entity: Participant is not whitelisted");
        }

        if (task.requireApproval) {
            require(
                currentStatus == AssignmentStatus.ACCEPTED || currentStatus == AssignmentStatus.REJECTED,
                "Entity: Not an accepted participant"
            );
        } else {
            require(
                currentStatus == AssignmentStatus.NONE || 
                currentStatus == AssignmentStatus.PENDING ||
                currentStatus == AssignmentStatus.ACCEPTED ||
                currentStatus == AssignmentStatus.REJECTED,
                "Entity: Invalid assignment status for completion"
            );
            // Auto-accept if not yet accepted (for non-approval tasks)
            if (currentStatus == AssignmentStatus.NONE || currentStatus == AssignmentStatus.PENDING) {
                _acceptParticipantInternal(taskId, msg.sender);
            }
        }

        isParticipant[taskId][msg.sender] = true;
        taskAssignments[taskId][msg.sender].status = AssignmentStatus.COMPLETED;
        taskAssignments[taskId][msg.sender].completionUrl = completionUrl;

        emit TaskAssignmentCompleted(taskId, msg.sender);
    }

    function rejectTaskSubmission(
        bytes32 taskId,
        address participant,
        string memory reason
    ) external override onlyTaskOwner(taskId) taskExists(taskId) whenNotPaused entityActive {
        require(!allocationsFrozen, "Entity: allocations frozen");
        require(taskAssignments[taskId][participant].status == AssignmentStatus.COMPLETED, "Entity: Task not completed");

        taskAssignments[taskId][participant].status = AssignmentStatus.REJECTED;
        emit TaskAssignmentRejected(taskId, participant, msg.sender, reason);
    }

    function approveTaskSubmission(
        bytes32 taskId,
        address participant
    ) external override onlyTaskOwner(taskId) taskExists(taskId) whenNotPaused entityActive {
        require(!allocationsFrozen, "Entity: allocations frozen");
        require(taskAssignments[taskId][participant].status == AssignmentStatus.COMPLETED, "Entity: Task not completed");

        taskAssignments[taskId][participant].status = AssignmentStatus.APPROVED;
        approvedParticipants[taskId].push(participant);

        emit TaskAssignmentApproved(taskId, msg.sender);
    }
}