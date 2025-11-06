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
  getAppCreatedById: `
  query GetAppCreatedById($id: ID!) {
    appCreated(id: $id) {
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

  getRoleGrantedById: `
  query GetRoleGrantedById($id: ID!) {
    roleGranted(id: $id) {
      id
      appId
      role
      account
      sender
      blockNumber
      blockTimestamp
    }
  }
`,
getRoleRevokedById: `
query GetRoleRevokedById($id: ID!) {
  roleRevoked(id: $id) {
    id
    appId
    role
    account
    sender
    blockNumber
  }
}
`,
getRoleAdminGrantedById: `
  query GetRoleAdminGrantedById($id: ID!) {
    roleAdminGranted(id: $id) {
      id
      appId
      role
      account
      sender
      blockNumber
    }
  }
`,
getRoleAdminRevokedById: `
  query GetRoleAdminRevokedById($id: ID!) {
    roleAdminRevoked(id: $id) {
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
  getTransferById: `
  query GetTransferById($id: ID!) {
    transfer(id: $id) {
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

  getApprovalById: `
  query GetApprovalById($id: ID!) {
    approval(id: $id) {
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


export const getTaskCreation = `
    query GetTaskCreation {
      taskCreateds(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
        id
        internal_id
        taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
        
        }
        rewardManagement{
        appId
        id
        name
        rewardManagement
        }
        createdBy
        blockNumber
        blockTimestamp
        transactionHash
      }
  
    }
  `;



  export const getOpenTasks = `
    query GetOpenTasks {
      taskCreateds(first: 10, orderBy: blockTimestamp, orderDirection: desc, where: { taskDetail_: { isOpen: true } }
      ) {
        id
        internal_id
        taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
        
        }
        rewardManagement{
        appId
        id
        name
        rewardManagement
        }
        createdBy
        blockNumber
        blockTimestamp
        transactionHash
      }
  
    }
  `;



  export const getCloseTasks = `
    query GetCloseTasks {
      taskCreateds(first: 100, orderBy: blockTimestamp, orderDirection: desc, where:{ taskDetail_:{ isOpen:false }}) {
        id
        internal_id
        taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
        
        }
        rewardManagement{
        appId
        id
        name
        rewardManagement
        }
        blockNumber
        blockTimestamp
        transactionHash
      }
  
    }
  `;



export const getTaskCreatedById = `
  query GetTaskCreatedById($internal_id: Bytes!) {
    taskCreateds(where:{ internal_id: $internal_id}) {
     id
      internal_id
       taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
        
        }
        rewardManagement{
        appId
        id
        name
        rewardManagement
        }
      createdBy
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;
// to get the partcipant status by task id

export const GetCombineParticipantsByTask = `
  query GetTaskParticipantsByTask($taskId: Bytes!) {
    pendingParticipants: participantTaskStatuses(where: { taskId: $taskId, status: "PENDING" }) {
      id
      participant
      status
      taskId
      lastUpdatedBlock
      lastUpdatedTimestamp
      taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
      }
      rewardManagement {
        appId
        id
        name
        rewardManagement
      }
    }
    acceptedParticipants: participantTaskStatuses(where: { taskId: $taskId, status: "ACCEPTED" }) {
      id
      participant
        taskId
        lastUpdatedBlock
      status
      lastUpdatedTimestamp
      taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
      }
      rewardManagement {
        appId
        id
        name
        rewardManagement
      }
    }
    completedParticipants: participantTaskStatuses(where: { taskId: $taskId, status: "COMPLETED" }) {
      id
      participant
      status
        taskId
        completionUrl
        lastUpdatedBlock
      lastUpdatedTimestamp
      taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
      }
      rewardManagement {
        appId
        id
        name
        rewardManagement
      }
    }
      verifiedParticipants: participantTaskStatuses(where: { taskId: $taskId, status: "VERIFIED" }) {
      id
      participant
      status
        taskId
        completionUrl
        lastUpdatedBlock
      lastUpdatedTimestamp
      taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
      }
      rewardManagement {
        appId
        id
        name
        rewardManagement
      }
    }
      rejectedParticipants: participantTaskStatuses(where: { taskId: $taskId, status: "REJECTED" }) {
      id
      participant
      status
      taskId
      rejectedReason
      lastUpdatedBlock
      lastUpdatedTimestamp
      taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
      }
      rewardManagement {
        appId
        id
        name
        rewardManagement
      }
    }
  }

  
`;


// Factory Queries
export const GetRewardManagement = `
    query GetDeployments {
      rewardManagementCreateds(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
        id
        registry
        entityId
        appId
        name
        rewardManagement
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  `;
 export const GetRewardManagementCreatedByAddress = `
  query GetRewardManagementCreatedByAddress($entityId: Bytes!) {
    rewardManagementCreateds(where: { entityId: $entityId }) {
     id
        rewardManagement
        registry
        entityId
        appId
        name
         
       tokenTransfers(first:30, orderBy: blockTimestamp, orderDirection: desc) {
        id
        token
        to
        amount
        remarks
        transferredBy
        }

        disbursements(first:30, orderBy: blockTimestamp, orderDirection: desc) {
        id
        taskId
        amount
        disbursedBy
        
        }
        blockNumber
        blockTimestamp
        transactionHash
      }
  }
`;


//query to get the participant task statistic

export const getParticipantTaskStatistics = `
  query GetParticipantTaskStatistics($participant: Bytes!) {
    
    applied: participantApplieds(
      where: { participant: $participant}
    ) {
      id
      taskDetail{
      name
      detailsUrl
      expiryDate
      totalRewardAmount
      
      }
    }
    
    accepted:taskAccepteds (
      where: { participant: $participant }
    ) {
      id
      taskDetail{
      name
      detailsUrl
      expiryDate
      totalRewardAmount
      
      }
    }
    
    completed: taskCompleteds(
      where: { participant: $participant}
    ) {
      id
      taskDetail{
      name
      detailsUrl
      expiryDate
      totalRewardAmount
      
      }
    }
    
    verified: taskVerifieds(
      where: { participant: $participant }
    ) {
      id
      taskDetail{
      name
      detailsUrl
      expiryDate
      totalRewardAmount
      
      }
    }
    
  }
`;



export const getParticipantTasks=`
   query GetParticipantTasks($participant: Bytes!) {
    participantTaskStatuses(where: { participant: $participant }) {
      id
      participant
      taskId
      status
      lastUpdatedBlock
      lastUpdatedTimestamp
      taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
        
        }
        rewardManagement{
        appId
        id
        name
        rewardManagement
        }
    }
}
  `


export const GetTaskOwnedByIndividual = `
query GetParticipantTasks($createdBy: Bytes!) {
   taskCreateds(where: { createdBy: $createdBy }) {
      id
      internal_id
      taskDetail {
        acceptedParticipantCount
        detailsUrl
        id
        expiryDate
        isOpen
        isTokenDisbursed
        maxParticipants
        name
        owner
        rewardToken
        totalRewardAmount
        requireApproval
        isWhitelisted
        verifiedParticipants
        }
        rewardManagement{
        appId
        id
        name
        rewardManagement
        }
    }
}
`

  export const GetRewardManagementTokenTransfers = `
  query GetRewardManagementTokenTransfers($rewardManagement: Bytes!) {
    rewardManagementCreateds(where: { rewardManagement: $rewardManagement }) {
     id
        rewardManagement
       tokenTransfers(first:100, orderBy: blockTimestamp, orderDirection: desc) {
        id
        token
        to
        amount
        remarks
        transferredBy
        }

        blockNumber
        blockTimestamp
        transactionHash
      }
  }
`;

export const GetRewardManagementDisbursements = `
  query GetRewardManagementDisbursements($rewardManagement: Bytes!) {
    rewardManagementCreateds(where: { rewardManagement: $rewardManagement }) {
     id
        rewardManagement
        disbursements(first:100, orderBy: blockTimestamp, orderDirection: desc) {
        id
        taskId
        amount
        disbursedBy
        }

        blockNumber
        blockTimestamp
        transactionHash
      }
  }
`;



//for the reward Redemption
export const GetRewards = `
    query GetRewards {
      rewardRedemptionCreateds(first: 100, orderBy: blockTimestamp, orderDirection: desc) {
        id
        rewardRedemption
        rewardId
        name
        tokensRequired
        category
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  `;

  
export const getRewardById = `
  query GetRewardById($rewardRedemption: Bytes!) {
    rewardRedemptionCreateds(where: { rewardRedemption: $rewardRedemption }) {
      id
      rewardRedemption
      rewardId
      name
      tokensRequired
      category
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;


export const GetRedeemedReward = `
query GetRedemptionStatuses($rewardRedemption: Bytes!) {
  redemptionStatuses(
    where: {
    
rewardRedemption: $rewardRedemption
      
    },
    first: 100,
    orderBy: blockTimestamp,
    orderDirection: desc
  ) {
    id
    redemptionId
    from
    amount
    status
    blockTimestamp
    transactionHash
    rewardRedemption {
      name
      tokensRequired
      category
      rewardRedemption
    }
  }
}
`;

export const GetRedeemedRewardsByParticipant = `
query GetRedeemedRewardsByParticipant($participant: Bytes!) {
  redemptionStatuses(
    where: { from: $participant },
    first: 100,
    orderBy: blockTimestamp,
    orderDirection: desc
  ) {
    id
    redemptionId
    from
    amount
    status
    blockNumber
    blockTimestamp
    transactionHash
    rewardRedemption {
      id
      rewardRedemption
      name
      tokensRequired
      category
      rewardId
    }
  }
}
`
export  const GetWhiteListedParticipantByTask = `
query GetWhiteListedParticipantByTask($taskId: Bytes!) {
  participantWhitelisteds(where: { taskId: $taskId }) {
    id
    taskId
    participant
    by
    blockNumber
    blockTimestamp
  }
}
`;

export const GetEntityOwner = `
query GetUserRewardManagements($userAddress: Bytes!) {
  rewardManagementCreateds(where: { entityOwner: $userAddress }) {
    id
    contractAddress
    entityOwner
  }
}
`



export  const GetRejectedParticipant = `
query GetRejected($taskId: Bytes!) {
  taskRejecteds(where: { internal_id: $taskId }) {
    id
    internal_id
    participant
    reason
    rejectedBy
    blockNumber
    blockTimestamp
  }
}
`;