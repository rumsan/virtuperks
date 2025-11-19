// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../interfaces/ITaskManagement.sol";
import "../interfaces/IAppRegistry.sol";
import "./RewardManagementBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

abstract contract TaskManagementWithOpenTasks is RewardManagementBase, ITaskManagement {
    bytes32[] internal openTasks;
    mapping(bytes32 => Task) public tasks;
    mapping(bytes32 => mapping(address => bool)) public isWhitelisted;
    mapping(bytes32 => mapping(address => TaskAssignment)) public taskAssignments;

    modifier onlyOwnerOrTaskOwner(bytes32 taskId) {
        require(
            app.hasRole(appId, OWNER, msg.sender) || msg.sender == tasks[taskId].owner,
            "Only owner or task owner can call this function"
        );
        _;
    }

    /// @notice This function creates a new Task
    /// @param task The task object
    function createTask(
        bytes32 taskId,
        Task memory task,
        address treasuryAddress,
        address[] memory _whitelistParticipants
    ) public virtual onlyRole(OWNER) whenNotPaused {
        require(tasks[taskId].owner == address(0), "Task ID already exists");
        require(taskId != bytes32(0), "Task ID cannot be zero");
        require(bytes(task.name).length > 0, "Task name cannot be empty");
        require(bytes(task.detailsUrl).length > 0, "Task details URL cannot be empty");
        require(task.owner != address(0), "Task must have an owner");
        require(task.expiryDate > block.timestamp, "Task expiry date must be in the future");
        require(task.rewardToken != address(0), "Reward token address cannot be zero");
        require(task.totalRewardAmount > 0, "Reward amount must be greater than 0");
        require(task.maxParticipants > 0, "Max participants must be greater than 0");

        // Set the isOpen flag before storing to avoid separate storage write
        task.isOpen = true;
        // Store task only once
        tasks[taskId] = task;
        openTasks.push(taskId);

        _allocateTokensToTask(taskId, task.rewardToken, treasuryAddress, task.totalRewardAmount);

        if (task.isWhitelisted) {
            for (uint256 i = 0; i < _whitelistParticipants.length; i++) {
                _addToWhitelist(taskId, _whitelistParticipants[i], false);
            }
        }

        emit TaskCreated(taskId, msg.sender);
    }

    /// @notice Retrieves all details of a specific task
    /// @param taskId The unique identifier of the task
    /// @return task The task details including its status and participants
    function getTask(bytes32 taskId) public view returns (Task memory task) {
        task = tasks[taskId];
    }

    /// @notice Retrieves open tasks with pagination
    /// @param offset Starting index for pagination
    /// @param limit Maximum number of tasks to return (capped at 100)
    /// @return taskIds Array of open task IDs for the requested page
    /// @return total Total number of open tasks available
    function getOpenTasks(
        uint256 offset,
        uint256 limit
    ) public view returns (bytes32[] memory taskIds, uint256 total) {
        total = openTasks.length;

        // Cap limit at 100 to prevent excessive gas usage
        if (limit > 100) {
            limit = 100;
        }

        // Return empty array if offset is beyond array length
        if (offset >= total) {
            return (new bytes32[](0), total);
        }

        // Calculate actual number of items to return
        uint256 remaining = total - offset;
        uint256 size = remaining < limit ? remaining : limit;

        taskIds = new bytes32[](size);
        for (uint256 i = 0; i < size; i++) {
            taskIds[i] = openTasks[offset + i];
        }

        return (taskIds, total);
    }

    /// @notice Closes a task, makes it unavailable for further participation
    /// @param taskId The unique identifier of the task to close
    function closeTask(bytes32 taskId) public virtual onlyOwnerOrTaskOwner(taskId) whenNotPaused {
        _closeTask(taskId);
    }

    /// @notice Internal implementation for closing a task
    /// @param taskId The unique identifier of the task to close
    function _closeTask(bytes32 taskId) internal {
        // Remove from openTasks array
        uint256 openTasksLength = openTasks.length;
        for (uint256 i = 0; i < openTasksLength; i++) {
            if (openTasks[i] == taskId) {
                openTasks[i] = openTasks[openTasksLength - 1];
                openTasks.pop();
                break;
            }
        }

        tasks[taskId].isOpen = false;
        emit TaskClosed(taskId, msg.sender);
    }

    /// @notice Closes all tasks that have passed their expiry date
    /// @dev Iterates through all open tasks and closes those that have expired
    function closeExpiredTasks() public whenNotPaused {
        uint256 i = 0;
        while (i < openTasks.length) {
            if (tasks[openTasks[i]].expiryDate < block.timestamp) {
                // When a task is closed, the last element of openTasks is moved to position i
                // So we need to check the same index again without incrementing
                _closeTask(openTasks[i]);
            } else {
                // Only increment if we didn't close a task
                i++;
            }
        }
    }

    /// @notice Check if a task is expired
    /// @param taskId The unique identifier of the task
    /// @return True if the task is expired, false otherwise
    function isTaskExpired(bytes32 taskId) public view returns (bool) {
        Task storage task = tasks[taskId];
        return task.owner != address(0) && task.expiryDate <= block.timestamp;
    }

    /// @notice Get all verified participants for a task
    /// @param taskId The unique identifier of the task
    /// @return participants Array of verified participant addresses
    function getTaskApprovedParticipants(bytes32 taskId) public view returns (address[] memory) {
        return tasks[taskId].approvedParticipants;
    }

    /// @notice Check if a task has reached its maximum participant limit
    /// @param taskId The unique identifier of the task
    /// @return True if the maximum limit is reached, false otherwise
    function isMaxParticipantsReached(bytes32 taskId) public view returns (bool) {
        Task storage task = tasks[taskId];
        if (task.maxParticipants == 0) {
            return false;
        }
        return task.acceptedParticipantCount >= task.maxParticipants;
    }

    /// @notice Update certain task details
    /// @param taskId The unique identifier of the task
    /// @param newDetailsUrl New URL for task details
    /// @param newExpiryDate New expiry date (0 to keep existing)
    function updateTaskDetails(
        bytes32 taskId,
        string memory newDetailsUrl,
        uint256 newExpiryDate
    ) public onlyOwnerOrTaskOwner(taskId) whenNotPaused {
        Task storage task = tasks[taskId];
        require(task.owner != address(0), "Task does not exist");
        require(task.isOpen, "Task is not open");

        // Update details URL if not empty
        if (bytes(newDetailsUrl).length > 0) {
            task.detailsUrl = newDetailsUrl;
        }

        // Update expiry date if provided and in the future
        if (newExpiryDate > 0) {
            require(newExpiryDate > block.timestamp, "New expiry date must be in the future");
            task.expiryDate = newExpiryDate;
        }

        emit TaskDetailsUpdated(taskId, msg.sender);
    }

    /// @notice Internal function to check if a task is open
    /// @dev Uses require statements to revert with appropriate messages
    /// @param taskId The unique identifier of the task to check
    function _isTaskOpen(bytes32 taskId) internal view {
        Task storage task = tasks[taskId];
        if (task.owner == address(0)) {
            revert("Task does not exist");
        }
        if (task.expiryDate <= block.timestamp) {
            revert("Task is expired");
        }
        if (!task.isOpen) {
            revert("Task is not open");
        }
    }

    function _checkMaximumParticipants(bytes32 taskId) internal view {
        Task storage task = tasks[taskId];
        if (task.maxParticipants > 0) {
            require(
                task.acceptedParticipantCount < task.maxParticipants,
                "Maximum participants limit reached"
            );
        }
    }

    // Internal helper for whitelist management
    function _addToWhitelist(bytes32 taskId, address participant, bool throwError) internal virtual;

    // Internal helper for token allocation
    function _allocateTokensToTask(
        bytes32 taskId,
        address tokenAddress,
        address treasuryAddress,
        uint256 amount
    ) internal virtual;
}
