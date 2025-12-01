import { Client, fetchExchange } from '@urql/core';
import {
  AppRegistryQueries,
  getApprovedTokensBySpender,
  getCloseTasks,
  GetCombineParticipantsByTask,
  GetEntityOwner,
  getOpenTasks,
  getParticipantTasks,
  getParticipantTaskStatistics,
  GetRedeemedReward,
  GetRedeemedRewardsByParticipant,
  GetRejectedParticipant,
  GetRemoveWhiteListedParticipantByTask,
  getRewardById,
  GetRewardManagement,
  GetRewardManagementCreatedByAddress,
  GetRewardManagementDisbursements,
  GetRewardManagementTokenTransfers,
  GetRewards,
  GetTaskByName,
  getTaskCreatedById,
  getTaskCreation,
  getTaskNoApproval,
  GetTaskOwnedByIndividual,
  GetTaskOwner,
  GetWhiteListedParticipantByTask,
  TokenQueries,
} from '../queries';

const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL!;

export class SubgraphService {
  private subgraphQuery: Client;

  constructor(graphurl: string) {
    this.subgraphQuery = new Client({
      url: graphurl,
      exchanges: [fetchExchange],
    });
  }

  // AppRegistry Related Services
  async getAppRegistryData() {
    try {
      const appCreated = await this.subgraphQuery.query(
        AppRegistryQueries.getAppCreated,
        {},
      );
      const roleManagement = await this.subgraphQuery.query(
        AppRegistryQueries.getRoleManagement,
        {},
      );
      return {
        appCreated: appCreated.data,
        roleManagement: roleManagement.data,
      };
    } catch (error) {
      console.error('Error fetching AppRegistry data:', error);
      return { error };
    }
  }

  // Token Related Services
  async getTokenData() {
    try {
      const transfers = await this.subgraphQuery.query(
        TokenQueries.getTransfers,
        {},
      );
      const approvals = await this.subgraphQuery.query(
        TokenQueries.getApprovals,
        {},
      );
      return { transfers: transfers.data, approvals: approvals.data };
    } catch (error) {
      console.error('Error fetching token data:', error);
      return { error };
    }
  }

  // RewardManagement Related Services
  async getAllTasks() {
    const { data, error } = await this.subgraphQuery.query(getTaskCreation, {});
    return { data, error };
  }

  async getTasksNoApproval() {
    const { data, error } = await this.subgraphQuery.query(
      getTaskNoApproval,
      {},
    );
    return { data, error };
  }

  async getOpenTasks() {
    const { data, error } = await this.subgraphQuery.query(getOpenTasks, {});
    return { data, error };
  }

  async getApprovedTokens(spender: string) {
    const { data, error } = await this.subgraphQuery.query(
      getApprovedTokensBySpender,
      { spender },
    );
    return { data, error };
  }

  async getCloseTasks() {
    const { data, error } = await this.subgraphQuery.query(getCloseTasks, {});
    return { data, error };
  }

  async getTaskById(id: string) {
    const { data, error } = await this.subgraphQuery.query(getTaskCreatedById, {
      internal_id: id,
    });
    return { data, error };
  }

  async getTaskByName(taskName: string) {
    if (!taskName) throw new Error('Task name is required');

    try {
      const { data, error } = await this.subgraphQuery.query(GetTaskByName, {
        taskName,
      });

      return { data, error };
    } catch (error) {
      console.error('Error fetching task by name:', error);
      return { data: null, error };
    }
  }

  async getCombineParticipantsByTask(taskId: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        GetCombineParticipantsByTask,
        { taskId },
      );
      return { data, error };
    } catch (error) {
      console.error('Error fetching task with participant status:', error);
      return { error };
    }
  }

  // async getTaskOwnedByIndividual(){
  //   try {

  //   } catch () {

  //   }
  // }

  // Factory Related Services
  async getDeployments() {
    try {
      const { data, error } = await this.subgraphQuery.query(
        GetRewardManagement,
        {},
      );
      return { data, error };
    } catch (error) {
      console.error('Error fetching deployments:', error);
      return { error };
    }
  }

  async getRewardManagementCreatedByAddress(entityId: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        GetRewardManagementCreatedByAddress,
        { entityId },
      );

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error(
        'Error fetching rewardManagementCreated by address:',
        error,
      );
      return { data: null, error };
    }
  }

  async getParticipantTasks(participantAddress: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        getParticipantTasks,
        { participant: participantAddress },
      );
      return { data, error };
    } catch (error) {
      console.error(
        'Error fetching rewardManagementCreated by address:',
        error,
      );
      return { data: null, error };
    }
  }

  async getTasksOwnedByIndividual(createdBy: string) {
    if (!createdBy) throw new Error('Creator address is required');

    try {
      const { data, error } = await this.subgraphQuery.query(
        GetTaskOwnedByIndividual,
        { createdBy: createdBy.toLowerCase() }, // match GraphQL variable
      );

      return { data, error };
    } catch (error) {
      console.error('Error fetching tasks owned by individual:', error);
      return { data: null, error };
    }
  }

  // service function to get participant task statistics

  async getParticipantTaskStatistics(participantAddress: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        getParticipantTaskStatistics,
        { participant: participantAddress },
      );
      return { data, error };
    } catch (error) {
      console.error('Error fetching participant task statistics:', error);
      return { data: null, error };
    }
  }

  async getRewardManagementTokenTransfers(rewardManagementAddress: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        GetRewardManagementTokenTransfers,
        { rewardManagement: rewardManagementAddress },
      );
      return { data, error };
    } catch (error) {
      console.error(
        `Error fetching token transfers for reward management address: ${rewardManagementAddress}`,
        error,
      );
      return { data: null, error };
    }
  }

  async getRewardManagementDisbursements(rewardManagementAddress: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        GetRewardManagementDisbursements,
        { rewardManagement: rewardManagementAddress },
      );
      return { data, error };
    } catch (error) {
      console.error(
        `Error fetching disbursements for reward management address: ${rewardManagementAddress}`,
        error,
      );
      return { data: null, error };
    }
  }

  // reward sevice function
  async getRewards() {
    try {
      const { data, error } = await this.subgraphQuery.query(GetRewards, {});
      return { data, error };
    } catch (error) {
      console.error('Error fetching rewards:', error);
      return { data: null, error };
    }
  }

  async getRewardById(rewardRedemption: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(getRewardById, {
        rewardRedemption,
      });
      return { data, error };
    } catch (error) {
      console.error('Error fetching reward by ID:', error);
      return { data: null, error };
    }
  }

  // service to get redeemed rewards
  async getRedeemedReward(rewardRedemption: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        GetRedeemedReward,
        { rewardRedemption },
      );
      return { data, error };
    } catch (error) {
      console.error('Error fetching rewards:', error);
      return { data: null, error };
    }
  }

  //service to get redeemed rewards by participant address
  async getRedeemedRewardsByParticipant(participantAddress: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        GetRedeemedRewardsByParticipant,
        { participant: participantAddress },
      );
      return { data, error };
    } catch (error) {
      console.error('Error fetching redeemed rewards by participant:', error);
      return { data: null, error };
    }
  }

  //servie to get whitelisted participants by task Id
  async getWhitelistedParticipantsByTaskId(taskId: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        GetWhiteListedParticipantByTask,
        { taskId },
      );
      return { data, error };
    } catch (error) {
      console.error(
        'Error fetching whitelisted participants by task ID:',
        error,
      );
      return { data: null, error };
    }
  }

  //servie to remove whitelisted participants by task Id
  async getRemovedWhitelistedParticipantsByTaskId(taskId: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        GetRemoveWhiteListedParticipantByTask,
        { taskId },
      );
      return { data, error };
    } catch (error) {
      console.error(
        'Error fetching removed whitelisted participants by task ID:',
        error,
      );
      return { data: null, error };
    }
  }

  //service function to get rejected participant  list of the task
  async getRejectedParticipantsByTaskId(taskId: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        GetRejectedParticipant,
        { taskId },
      );

      return { data, error };
    } catch (error) {
      console.error('Error fetching rejected participants by task ID:', error);
      return { data: null, error };
    }
  }

  //service funtion to get entity owner by user address
  async getEntityOwnerByUserAddress(userAddress: string): Promise<boolean> {
    try {
      const { data, error } = await this.subgraphQuery.query(GetEntityOwner, {
        userAddress,
      });

      if (error) {
        console.error('Error fetching entity owner by user address:', error);
        return false;
      }

      // Return true if ownerAddeds array exists and has at least one entry
      return !!(data?.ownerAddeds && data.ownerAddeds.length > 0);
    } catch (error) {
      console.error('Error fetching entity owner by user address:', error);
      return false;
    }
  }

  // service to check task owner by address
  async getTaskOwnerUserAddress(userAddress: string): Promise<boolean> {
    try {
      const { data, error } = await this.subgraphQuery.query(GetTaskOwner, {
        userAddress,
      });

      return !!(data?.taskDetails && data.taskDetails.length > 0);
    } catch (error) {
      console.error('Error fetching task owner by user address:', error);
      return false;
    }
  }
}
