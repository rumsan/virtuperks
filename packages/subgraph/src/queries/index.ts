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
    taskCreateds(first: 15) {
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
    particiantApplieds(first: 10) {
      id
      participant
      status
      blockNumber
      blockTimestamp
      transactionHash
    
    taskDetail {
    task{
      entityTaskManager{
        entityTaskManager
      }
    }
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
    taskCompleteds(first: 10, orderBy: blockTimestamp) {
      id
      taskId
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
    taskAccepteds(first: 10, orderBy: blockTimestamp) {
      id
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
      }
    }
  }
`;

export const TaskApprovedList = `
  query TaskApprovedList {
    taskApproveds(first: 10, orderBy: blockTimestamp) {
      id
      taskId
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
      }
    }
  }
`;
