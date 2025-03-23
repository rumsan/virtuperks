export const CreatedAppList = `query 
  CreatedAppList
  {
    appCreateds(first:10){
    appId
    blockNumber
    blockTimestamp
    account
  }
  }`;

export const RoleGrantedList = `
  query RoleGrantedList {
    roleGranteds(first: 10, orderBy: appId) {
      id
      appId
      role
      account
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const ApprovalList = `
  query ApprovalList {
    approvals(first: 10, orderBy: owner) {
      id
      owner
      spender
      value
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const TransferList = `
  query TransferList {
    transfers(first: 10, orderBy: from) {
      id
      from
      to
      value
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const TaskCreatedList = `
  query TaskCreatedList {
    taskCreateds(first: 100) {
      id
      createdBy
      blockNumber
      blockTimestamp
      transactionHash
    
    taskDetail {
    allowedWallets
    detailsUrl
    expiryDate
    id
    isActive
    maxParticipants
    owner
    rewardAmount
    rewardToken
    }
    entityTaskManager {
    _appId
    _name
    id
    }
}
  }
`;

export const ParticiantAppliedList = `
  query ParticiantAppliedList {
    particiantApplieds(first: 100) {  # Increased limit to make sure we get all data
      id
      internal_id
      participant
      status
      blockNumber
      blockTimestamp
      transactionHash
      taskDetail {
        id   # Make sure this field exists
        allowedWallets
        detailsUrl
        expiryDate
        isActive
        maxParticipants
        owner
        rewardAmount
        rewardToken
        task {
        entityTaskManager {
        entityTaskManager
        
        }
        }
      }
    }
  }
`;

export const EntityTaskManagerCreatedList = `
  query EntityTaskManagerCreatedList {
    entityTaskManagerCreateds(first: 10, orderBy: blockTimestamp) {
      id
      entityTaskManager
      aclAddress
      _appId
      _name
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const TaskCompletedList = `
  query TaskCompletedList {
    taskCompleteds(first: 100, orderBy: blockTimestamp) {
      id
      internal_id
      participant
      blockNumber
      blockTimestamp
      transactionHash
      status
      taskDetail {
      allowedWallets
        detailsUrl
        id
        isActive
        maxParticipants
        owner
        rewardAmount
      }
    }
  }
`;

export const TaskAcceptedList = `
  query TaskAcceptedList {
    taskAccepteds(first: 100, orderBy: blockTimestamp) {
      id
      internal_id
      participant
      blockNumber
      blockTimestamp
      transactionHash
      status
      taskDetail {
      allowedWallets
        detailsUrl
        id
        isActive
        maxParticipants
        owner
        maxParticipants
        rewardAmount
        rewardToken
      }
    }
  }
`;

export const TaskApprovedList = `
  query TaskApprovedList {
    taskApproveds(first: 100, orderBy: blockTimestamp) {
      id
      internal_id
      approver
      blockNumber
      blockTimestamp
      transactionHash
      status
      taskDetail {
       allowedWallets
        detailsUrl
        id
        isActive
        maxParticipants
        owner
        rewardAmount
        rewardToken
          task {
        entityTaskManager {
        entityTaskManager
        
        }
        }
      }
    }
  }
`;

export const GetParticipantTaskStatusWithVariables = `
  query GetParticipantTaskStatus($participant: Bytes!, $taskId: Bytes!) {
    participantTaskStatuses(where: { participant: $participant, taskId: $taskId }) {
      id
      participant
      taskId
      status
      lastUpdatedBlock
      lastUpdatedTimestamp
      taskDetail {
        id
        detailsUrl
        rewardToken
        rewardAmount
        maxParticipants
        expiryDate
        owner
        isActive
        allowedWallets
        task {
          id
          internal_id
          createdBy
          blockNumber
          blockTimestamp
          transactionHash
          entityTaskManager {
            id
            entityTaskManager
            aclAddress
            _appId
            _name
            blockNumber
            blockTimestamp
            transactionHash
          }
        }
      }
    }
  }
`;

export const GetTaskParticipantsWithStatus = `
  query GetTaskParticipantsWithStatus($taskId: Bytes!) {
    participantTaskStatuses(where: { taskId: $taskId }) {
      id
      participant
      taskId
      status
      lastUpdatedBlock
      lastUpdatedTimestamp
      taskDetail {
        id
        detailsUrl
        rewardToken
        rewardAmount
        maxParticipants
        expiryDate
        owner
        isActive
        allowedWallets
        task {
          id
          internal_id
          createdBy
          blockNumber
          blockTimestamp
          transactionHash
          entityTaskManager {
            id
            entityTaskManager
            aclAddress
            _appId
            _name
            blockNumber
            blockTimestamp
            transactionHash
          }
        }
      }
    }
  }
`;

export const  GetTaskApprovedAndCompleted= `
  query GetTaskApprovedAndCompleted($taskId: Bytes!) {
    taskApproveds(where: { taskDetail: $taskId }) {
      id
      internal_id
      approver
      blockNumber
      blockTimestamp
      transactionHash
      status
      taskDetail {
        allowedWallets
        detailsUrl
        id
        isActive
        maxParticipants
        owner
        rewardAmount
        rewardToken
        task {
          entityTaskManager {
            entityTaskManager
            _name
          }
        }
      }
    }
    taskCompleteds(where: { taskDetail: $taskId }) {
      id
      internal_id
      participant
      blockNumber
      blockTimestamp
      transactionHash
      status
      taskDetail {
        allowedWallets
        detailsUrl
        id
        isActive
        maxParticipants
        owner
        rewardAmount
      }
    }
  }
`;