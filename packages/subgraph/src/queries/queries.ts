export const CreatedAppList = `
  query CreatedAppList {
    appCreateds(first: 10, orderBy: appId) {
      id
      appId
      account
      blockNumber
      blockTimestamp
      transactionHash
    }
  }


`;

export const RoleGrantedList = `
  query RoleGranted {
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
  query Approval {
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
  query Transfer {
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
    taskCreateds(first: 10, orderBy: TaskManagement_id) {
      id
      TaskManagement_id
      createdBy
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export const ParticiantAppliedList = `
  query ParticiantApplied {
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
