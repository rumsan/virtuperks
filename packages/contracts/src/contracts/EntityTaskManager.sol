// SPDX-License-Identifier: LGPL-3.0
pragma solidity 0.8.20;

import './interfaces/IAccessManagerV2.sol';
import './interfaces/IEntityTaskManager.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

//TODO: Don not allow token to withdraw from this contract if it is already allocated as rewards
contract EntityTaskManager is IEntityTaskManager {
    event PINGED(address indexed sender, uint256 timestamp);
    IAccessManagerV2 public acl;
    string public name;

    bytes32 public constant ENTITY_OWNER = keccak256('ENTITY_OWNER');
    bytes32 public constant PARTICIPANT = keccak256('PARTICIPANT');

    mapping(bytes32 => Task) public tasks;
    mapping(bytes32 => mapping(address => STATUS)) public taskAssignments;
    // mapping(address => uint256) public allocatedRewards;

    bytes32 public appId;

    constructor(address aclAddress, bytes32 _appId, string memory _name) {
        acl = IAccessManagerV2(aclAddress);
        appId = _appId;
        name = _name;
    }

    modifier onlyRole(bytes32 role) {
        require(acl.hasRole(appId, role, msg.sender), 'Access Denied');
        _;
    }

    //Just for testin
    function ping() public {
        emit PINGED(msg.sender, block.timestamp);
    }

    /// @notice This function creates a new Task
    /// @param task The task object

    function createTask(Task memory task) public onlyRole(ENTITY_OWNER) {
        require(
            task.maxParticipants > 0,
            'Max participants should be greater than 0'
        );
        if (task.owner == address(0)) {
            task.owner = msg.sender;
        }
        bytes32 taskId = findHash(task.detailsUrl);
        tasks[taskId] = task;
        // Emit the new event with all task details

        emit TaskCreated(
            taskId,
            msg.sender // createdBy should be msg.sender
        );
    }

    /// @notice This function will provide access for participant to apply for the task
    /// @param taskId The id of the task

    function participate(bytes32 taskId) public onlyRole(PARTICIPANT) {
        require(tasks[taskId].isActive, 'Task is not active');
        require(tasks[taskId].expiryDate > block.timestamp, 'Task is expired');
        bool isAllowed = false;
        for (uint i = 0; i < tasks[taskId].allowedWallets.length; i++) {
            if (tasks[taskId].allowedWallets[i] == msg.sender) {
                isAllowed = true;
                break;
            }
        }
        require(isAllowed, 'User is not allowed to apply for the task');

        taskAssignments[taskId][msg.sender] = STATUS.UNACCEPTED;
        emit ParticiantApplied(taskId, msg.sender);
    }

    function acceptParticipant(
        bytes32 taskId,
        address participant
    ) public onlyRole(ENTITY_OWNER) {
        require(tasks[taskId].owner != address(0), 'Task does not exist');
        require(tasks[taskId].isActive, 'Task is not active');
        taskAssignments[taskId][participant] = STATUS.ACCEPTED;
        emit TaskAccepted(taskId);
    }

    /// @notice This function will change the status of the task
    /// @param taskId The id of the task
    function completeTask(bytes32 taskId) public onlyRole(PARTICIPANT) {
        require(
            taskAssignments[taskId][msg.sender] == STATUS.ACCEPTED,
            'Task is not accepted or already completed'
        );
        require(tasks[taskId].expiryDate > block.timestamp, 'Task is expired');
        require(tasks[taskId].isActive, 'Task is not active');

        taskAssignments[taskId][msg.sender] = STATUS.COMPLETED;
        emit TaskCompleted(taskId, msg.sender);
    }

    /// @notice This function will change the status of the task
    /// @param taskId The id of the task
    function verifyCompletion(bytes32 taskId) external {
        
        require(tasks[taskId].owner == msg.sender, 'not a owner of this task');
        require(tasks[taskId].isActive, 'Task is not active');

        uint256 verifiedCount = 0;
        address[] memory verifiedTaskParticipant = new address[](
            tasks[taskId].maxParticipants
        );
        if (tasks[taskId].allowedWallets.length == 0) return;
        for (uint i = 0; i < tasks[taskId].allowedWallets.length; i++) {
            if (
                taskAssignments[taskId][tasks[taskId].allowedWallets[i]] ==
                STATUS.COMPLETED
            ) {
                taskAssignments[taskId][
                    tasks[taskId].allowedWallets[i]
                ] = STATUS.VERIFIED;
                verifiedTaskParticipant[verifiedCount] = tasks[taskId]
                    .allowedWallets[i];
                verifiedCount++;
            }
        }
        if (verifiedCount == 0) return;

        uint256 rewardsPerParticiapant = tasks[taskId].rewardAmount /
            verifiedCount;
        for (uint i = 0; i < verifiedCount; i++) {
            // allocatedRewards[verifiedTaskParticipant[i]] += rewardsPerParticiapant;
            IERC20(tasks[taskId].rewardToken).transfer(
                verifiedTaskParticipant[i],
                rewardsPerParticiapant
            );
        }

        tasks[taskId].isActive = false;

        emit TaskApproved(taskId, msg.sender);
    }

    function findHash(string memory detailsUrl) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(detailsUrl));
    }
}
