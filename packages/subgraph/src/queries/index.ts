// AppRegistry Queries
export const AppRegistryQueries = {
  getAppCreated: `
    query GetAppCreated {
      appCreateds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
        id
        appId
        admin
        sender
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  `,

  getRoleManagement: `
    query GetRoleManagement {
      roleGranteds(first: 10) {
        id
        appId
        role
        account
        sender
        blockNumber
        blockTimestamp
      }
      roleRevokeds(first: 10) {
        id
        appId
        role
        account
        sender
        blockNumber
      }
      roleAdminGranteds(first: 10) {
        id
        appId
        role
        account
        sender
        blockNumber
      }
      roleAdminRevokeds(first: 10) {
        id
        appId
        role
        account
        sender
        blockNumber
      }
    }
  `,
};

// RewardToken Queries
export const TokenQueries = {
  getTransfers: `
    query GetTransfers {
      transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
        id
        from
        to
        value
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  `,

  getApprovals: `
    query GetApprovals {
      approvals(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
        id
        owner
        spender
        value
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  `,
};

// RewardManagement Queries
export const RewardManagementQueries = {
  getTaskCreation: `
    query GetTaskCreation {
      taskCreateds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
        id
        internal_id
        createdBy
        blockNumber
        blockTimestamp
        transactionHash
      }
      taskDetailsUpdateds(first: 10) {
        id
        internal_id
        updatedBy
        blockNumber
        blockTimestamp
      }
    }
  `,

  getParticipationStatus: `
    query GetParticipationStatus($taskId: Bytes!) {
      participantApplieds(where: { internal_id: $taskId }) {
        id
        internal_id
        participant
        blockNumber
        blockTimestamp
      }
      taskAccepteds(where: { internal_id: $taskId }) {
        id
        internal_id
        participant
        blockNumber
        blockTimestamp
      }
      taskCompleteds(where: { internal_id: $taskId }) {
        id
        internal_id
        participant
        blockNumber
        blockTimestamp
      }
      taskVerifieds(where: { internal_id: $taskId }) {
        id
        internal_id
        participant
        verifier
        blockNumber
        blockTimestamp
      }
    }
  `,

  getWhitelistStatus: `
    query GetWhitelistStatus($taskId: Bytes!) {
      participantWhitelisteds(where: { taskId: $taskId }) {
        id
        taskId
        participant
        by
        blockNumber
        blockTimestamp
      }
      participantRemovedFromWhitelists(where: { taskId: $taskId }) {
        id
        taskId
        participant
        by
        blockNumber
        blockTimestamp
      }
    }
  `,

  getDisbursements: `
    query GetDisbursements($taskId: Bytes!) {
      disbursementToTasks(where: { taskId: $taskId }) {
        id
        taskId
        amount
        disbursedBy
        blockNumber
        blockTimestamp
      }
      additionalDisbursementToTasks(where: { taskId: $taskId }) {
        id
        taskId
        amount
        remarks
        disbursedBy
        blockNumber
        blockTimestamp
      }
    }
  `,

  getContractState: `
    query GetContractState {
      contractPauseds(first: 1, orderBy: blockTimestamp, orderDirection: desc) {
        id
        by
        blockNumber
        blockTimestamp
      }
      contractUnpauseds(first: 1, orderBy: blockTimestamp, orderDirection: desc) {
        id
        by
        blockNumber
        blockTimestamp
      }
    }
  `,
};

// Factory Queries
export const FactoryQueries = {
  getDeployments: `
    query GetDeployments {
      rewardManagementCreateds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
        id
        rewardManagement
        aclAddress
        appId
        name
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  `,
};
