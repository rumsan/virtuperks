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
    taskCreateds(first: 100,orderBy: blockTimestamp, orderDirection: desc) {
      id
      internal_id
      createdBy
      blockNumber
      blockTimestamp
      transactionHash
    
    taskDetail {
    taskName
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

export const EntityTaskManagerCreatedList = `
  query EntityTaskManagerCreatedList{
    entityTaskManagerCreateds(
      first: 20, 
      orderBy: blockTimestamp, 
     
    ) {
      id
      entityTaskManager
      aclAddress
      _appId
      _name
      blockNumber
      blockTimestamp
      transactionHash
      totalTokenBalance
      remainingBalance
     
    }
  }
`;

export const getEntityDetailById = `
  query getEntityDetailById($id: Bytes) {
    entityTaskManagerCreateds(
      where: { entityTaskManager: $id },first: 1
    ) {
      id
      entityTaskManager
      aclAddress
      _appId
      _name
      blockNumber
      blockTimestamp
      transactionHash
      totalTokenBalance
      remainingBalance
      tasks {
        internal_id
        createdBy
        taskDetail {
          detailsUrl
          rewardAmount
          expiryDate
          owner
          isActive
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
        taskName
        rewardToken
        rewardAmount
        maxParticipants
        expiryDate
        owner
        isActive
        allowedWallets
    
    }
      entityTaskManager {
      id
      entityTaskManager
      _appId
        _name
      
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
        taskName
        detailsUrl
        rewardToken
        rewardAmount
        maxParticipants
        expiryDate
        owner
        isActive
        allowedWallets
      
      }
         entityTaskManager {
         id
        entityTaskManager
        _appId
        _name
       
}
    }
  }
`;

export const GetTaskApprovedAndCompleted = `
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
        taskName
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
      taskName
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

export const GetTaskDetailsById = `
  query GetTaskDetailsById($taskId: Bytes!) {
    taskCreateds(where: { internal_id: $taskId }, first: 1) {
      id
      internal_id
      createdBy
      blockNumber
      blockTimestamp
      transactionHash
      taskDetail {
      taskName
        detailsUrl
        rewardToken
        rewardAmount
        maxParticipants
        expiryDate
        owner
        isActive
        allowedWallets
      }
      entityTaskManager {
        entityTaskManager
      _appId
        _name
      
      }
    }
  }
`;

export const GetAllTasksForParticipant = `
  query GetAllTasksForParticipant($participant: Bytes!) {
    participantTaskStatuses(where: { participant: $participant }) {
      id
      participant
      taskId
      status
      lastUpdatedBlock
      lastUpdatedTimestamp
      taskDetail {
        id
        taskName
        detailsUrl
        rewardToken
        rewardAmount
        maxParticipants
        expiryDate
        owner
        isActive
        allowedWallets
   
      }
        entityTaskManager {
        id
        entityTaskManager
        _appId
        _name
        
        }
    }
  }
`;

export const getAllParticipantsByRole = `
  query FilterByRole($role: Bytes!) {
    roleGranteds(where: { role: $role }) {
      account
      appId
      id
      role
    }
  }
`;
