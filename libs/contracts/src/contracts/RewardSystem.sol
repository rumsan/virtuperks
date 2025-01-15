// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IAccessManagerV2.sol';

contract RewardSystem {
    IAccessManagerV2 public acl;

    event TaskCreated(string indexed id, address indexed createdBy);
    event TaskAccepted(string indexed id);
    event AssignmentAccepted(string indexed id);
    event AssignmentCompleted(string indexed id);
    event TaskApproved(string indexed id);

    bytes32 public constant ENTITY_OWNER = keccak256('ENTITY_OWNER');
    bytes32 public constant TASK_OWNER = keccak256('TASK_OWNER');
    bytes32 public constant PARTICIPANT = keccak256('PARTICIPANT');

    enum TaskStatus {
        OPEN,
        CLOSED
    }

    enum STATUS {
        UNACCEPTED,
        ACCEPTED,
        COMPLETED,
        VERIFIED
    }

    struct Task {
        string detailsUrl;
        address rewardToken;
        uint256 rewardAmount;
        address[] allowedWallets;
        uint expiryDate;
        address owner;
        bool isActive;
    }

    struct TaskAssignment {
        address participant;
        STATUS status;
    }

    mapping(string => Task) public tasks;
    mapping(string => TaskAssignment) public taskAssignments;

    bytes32 private appId;

    constructor(address aclAddress, bytes32 _appId) {
        acl = IAccessManagerV2(aclAddress);
        appId = _appId;
    }

    /// @notice This function creates a new Task
    /// @param task The task object
    function createTask(Task memory task) public onlyRole(ENTITY_OWNER){
        if (task.owner == address(0)) {
            task.owner = msg.sender;
        }

        tasks[task.detailsUrl] = task;

        emit TaskCreated(task.detailsUrl, task.owner);
    }

    /// @notice This function will provide access for participant to apply for the task
    /// @param taskId The id of the task
    function participate(string memory taskId) public onlyRole(PARTICIPANT){
        require(tasks[taskId].isActive, "Task is not active");
        require(tasks[taskId].expiryDate > block.timestamp, "Task is expired");
        bool isAllowed = false;
        for (uint i = 0; i < tasks[taskId].allowedWallets.length; i++) {
            if (tasks[taskId].allowedWallets[i] == msg.sender) {
                isAllowed = true;
                break;
            }
        }
        require(isAllowed, "User is not allowed to apply for the task");
        require(
            taskAssignments[taskId].participant == address(0),
            "User is already registered for the task"
        );

        taskAssignments[taskId] = TaskAssignment({
            participant: msg.sender,
            status: STATUS.UNACCEPTED
        });

    }

    /// @notice This function will change the status of the task
    /// @param taskId The id of the task
    function completeAssignment(string memory taskId) public onlyRole(PARTICIPANT){
        require(
            taskAssignments[taskId].participant == msg.sender,
            "User is not allowed to complete the task"
        );
        require(
            taskAssignments[taskId].status == STATUS.ACCEPTED,
            "Task is not accepted or already completed"
        );
        require(tasks[taskId].expiryDate > block.timestamp, "Task is expired");
        require(tasks[taskId].isActive, "Task is not active");

        taskAssignments[taskId].status = STATUS.COMPLETED;
    }

    /// @notice This function will change the status of the task
    /// @param taskId The id of the task
    function approveTask(string memory taskId) external onlyRole(ENTITY_OWNER){
        require(tasks[taskId].owner != address(0), "Task does not exist");
        require(tasks[taskId].isActive, "Task is not active");
        require(
            taskAssignments[taskId].status == STATUS.VERIFIED,
            "Task is not completed"
        );

        tasks[taskId].isActive = false;
        emit TaskApproved(taskId);
    }

    modifier onlyRole(bytes32 role) {
        require(acl.hasRole(appId, role, msg.sender), "Access Denied");
        _;
    }

}
