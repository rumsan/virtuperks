// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../interfaces/IParticipantManagement.sol";
import "../interfaces/IAppRegistry.sol";
import "./TaskManagement.sol";

abstract contract ParticipantManagement is TaskManagement, IParticipantManagement {
    bytes32 public constant PARTICIPANT = keccak256("PARTICIPANT");

    modifier isEligibleToParticipate(bytes32 taskId) {
        //restrict at app level
        if (app.isPrivate(appId)) {
            require(
                app.hasRole(appId, PARTICIPANT, msg.sender),
                "User is not registered participant in the app."
            );
        }

        // restrict at task level
        if (tasks[taskId].isWhitelisted) {
            require(isWhitelisted[taskId][msg.sender], "User is not whitelisted for this task.");
        }
        _;
    }

    modifier onlyTaskOwner(bytes32 taskId) {
        require(msg.sender == tasks[taskId].owner, "Only task owner can call this function");
        _;
    }

    function addToWhitelist(
        bytes32 taskId,
        address participant,
        bool throwError
    ) public onlyRole(OWNER) {
        _addToWhitelist(taskId, participant, throwError);
    }

    function _addToWhitelist(
        bytes32 taskId,
        address participant,
        bool throwError
    ) internal override {
        Task storage task = tasks[taskId];
        if (!task.isWhitelisted) {
            require(!throwError, "Task does not require whitelist");
        }

        if (app.isPrivate(appId)) {
            if (app.hasRole(appId, PARTICIPANT, participant)) {
                isWhitelisted[taskId][participant] = true;
                emit ParticipantWhitelisted(taskId, participant, msg.sender);
            } else {
                require(!throwError, "User is not registered participant in the app.");
            }
        } else {
            isWhitelisted[taskId][participant] = true;
            emit ParticipantWhitelisted(taskId, participant, msg.sender);
        }
    }

    function removeFromWhitelist(bytes32 taskId, address participant) public onlyRole(OWNER) {
        delete isWhitelisted[taskId][participant];
        emit ParticipantRemovedFromWhitelist(taskId, participant, msg.sender);
    }

    /// @notice This function will provide access for participant to apply for the task
    /// @param taskId The id of the task
    function participate(bytes32 taskId) public isEligibleToParticipate(taskId) whenNotPaused {
        _isTaskOpen(taskId);
        require(
            taskAssignments[taskId][msg.sender].status == AssignmentStatus.NONE,
            "User is already participating in this task"
        );
        require(!isMaxParticipantsReached(taskId), "Maximum participants limit reached");

        // Set participant status
        taskAssignments[taskId][msg.sender].status = AssignmentStatus.PENDING;
        emit TaskAssignmentApplied(taskId, msg.sender);
    }

    function acceptParticipant(bytes32 taskId, address participant) public onlyRole(OWNER) {
        Task storage task = tasks[taskId];
        _isTaskOpen(taskId);
        require(!isMaxParticipantsReached(taskId), "Maximum participants limit reached");

        // Increment accepted participant count
        task.acceptedParticipantCount++;
        taskAssignments[taskId][participant].status = AssignmentStatus.ACCEPTED;
        emit TaskAssignmentAccepted(taskId, participant);
    }

    /// @notice This function will change the status of the task
    /// @param taskId The id of the task
    function completeTask(
        bytes32 taskId,
        string memory completionUrl
    ) public isEligibleToParticipate(taskId) {
        _isTaskOpen(taskId);
        TaskAssignment storage taskAssignment = taskAssignments[taskId][msg.sender];

        if (tasks[taskId].requireApproval) {
            require(
                taskAssignment.status == AssignmentStatus.ACCEPTED,
                "This task requires user to be accepted to complete task"
            );
        }

        taskAssignment.status = AssignmentStatus.COMPLETED;
        taskAssignment.completionUrl = completionUrl;
        emit TaskAssignmentCompleted(taskId, msg.sender);
    }

    /// @dev Returns a mutable storage reference for modification by the caller.
    /// Cannot be marked as 'view' despite only reading state internally,
    /// because it returns a storage reference that will be modified.
    function _getOpenTaskAssignment(
        bytes32 taskId,
        address participant
    ) internal returns (TaskAssignment storage) {
        _isTaskOpen(taskId);
        return taskAssignments[taskId][participant];
    }

    function _changeTaskAssignmentStatus(
        TaskAssignment storage taskAssignment,
        AssignmentStatus status
    ) internal {
        require(
            taskAssignment.status != AssignmentStatus.DISBURSED,
            "Participant has already been disbursed."
        );
        taskAssignment.status = status;
    }

    /// @notice This function will change the status of the task
    /// @param taskId The id of the task
    function approveTaskSubmission(
        bytes32 taskId,
        address participant
    ) public onlyTaskOwner(taskId) {
        TaskAssignment storage taskAssignment = _getOpenTaskAssignment(taskId, participant);

        require(
            taskAssignment.status == AssignmentStatus.COMPLETED,
            "Task must be completed before verification"
        );

        Task storage task = tasks[taskId];
        if (task.maxParticipants > 0) {
            require(
                task.approvedParticipants.length < task.maxParticipants,
                "Maximum verified participants limit reached"
            );
        }

        _changeTaskAssignmentStatus(taskAssignment, AssignmentStatus.APPROVED);
        tasks[taskId].approvedParticipants.push(participant);

        emit TaskAssignmentVerified(taskId, participant, msg.sender);

        if (task.maxParticipants > 0) {
            if (task.approvedParticipants.length == task.maxParticipants) {
                _closeTask(taskId);
            }
        }
    }

    /// @notice This function allows the task owner to reject a participant with a reason
    /// @param taskId The unique identifier of the task
    /// @param participant The address of the participant to reject
    /// @param reason The reason for rejecting the participant
    function rejectTaskSubmission(
        bytes32 taskId,
        address participant,
        string memory reason
    ) public onlyTaskOwner(taskId) {
        TaskAssignment storage taskAssignment = _getOpenTaskAssignment(taskId, participant);

        // Ensure the participant is in a valid state to be rejected
        require(
            taskAssignment.status == AssignmentStatus.COMPLETED,
            "Participant cannot be rejected in the current state"
        );

        // Update the participant's status to REJECTED
        _changeTaskAssignmentStatus(taskAssignment, AssignmentStatus.REJECTED);

        // Emit the TaskRejected event with the reason
        emit TaskAssignmentRejected(taskId, participant, msg.sender, reason);
    }

    /// @notice Get the task assignment details for a specific participant
    /// @param taskId The unique identifier of the task
    /// @param participant The address of the participant
    /// @return assignment The task assignment details
    function getParticipantTaskAssignment(
        bytes32 taskId,
        address participant
    ) public view returns (TaskAssignment memory) {
        return taskAssignments[taskId][participant];
    }
}
