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
    particiantApplieds(first: 10, orderBy: TaskManagement_id) {
      id
      TaskManagement_id
      participant
      blockNumber
      blockTimestamp
      transactionHash
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
