import { Client, fetchExchange } from '@urql/core';
import {
  AppRegistryQueries,
  getCloseTasks,
  GetCombineParticipantsByTask,
  getOpenTasks,
  getParticipantTasks,
  getParticipantTaskStatistics,
  getParticipantWhiteListed,
  GetRedeemedReward,
  GetRedeemedRewardsByParticipant,
  getRewardById,
  GetRewardManagement,
  GetRewardManagementCreatedByAddress,
  GetRewardManagementDisbursements,
  GetRewardManagementTokenTransfers,
  GetRewards,
  getTaskCreatedById,
  getTaskCreation,
  RewardManagementQueries,
  TokenQueries
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
      const appCreated = await this.subgraphQuery.query(AppRegistryQueries.getAppCreated, {});
      const roleManagement = await this.subgraphQuery.query(AppRegistryQueries.getRoleManagement, {});
      return { appCreated: appCreated.data, roleManagement: roleManagement.data };
    } catch (error) {
      console.error('Error fetching AppRegistry data:', error);
      return { error };
    }
  }

  // Token Related Services
  async getTokenData() {
    try {
      const transfers = await this.subgraphQuery.query(TokenQueries.getTransfers, {});
      const approvals = await this.subgraphQuery.query(TokenQueries.getApprovals, {});
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

 
  async getOpenTasks() {
    
      const { data, error } = await this.subgraphQuery.query(getOpenTasks, {})
      return { data, error };
    
  }

 
  async getCloseTasks() {
    
      const { data, error } = await this.subgraphQuery.query(getCloseTasks, {})
      return { data, error };
  }




  async getTaskById(id: string) {
    const { data, error } = await this.subgraphQuery.query(getTaskCreatedById, { id })
    return { data, error }
  }
  
  

  


  async getCombineParticipantsByTask(taskId: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        GetCombineParticipantsByTask,
        { taskId }
      );
      return { data, error };
    } catch (error) {
      console.error('Error fetching task with participant status:', error);
      return { error };


    }
  






  }
  
  async getContractState() {
    try {
      const { data, error } = await this.subgraphQuery.query(
        RewardManagementQueries.getContractState,
        {}
      );
      return { data, error };
    } catch (error) {
      console.error('Error fetching contract state:', error);
      return { error };
    }
  }

  // Factory Related Services
  async getDeployments() {
    try {
      const { data, error } = await this.subgraphQuery.query(GetRewardManagement, {});
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
        { entityId }
      );
  
      if (error) {
        throw error;
      }
  
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching rewardManagementCreated by address:', error);
      return { data: null, error };
    }
  }

  async getParticipantTasks(participantAddress: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        getParticipantTasks,
        { participant: participantAddress }
      )
      return { data, error }
    } catch (error) {

      console.error('Error fetching rewardManagementCreated by address:', error);
      return { data: null, error };
    }
  }

  // service function to get participant task statistics

  async getParticipantTaskStatistics(participantAddress: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        getParticipantTaskStatistics,
        { participant: participantAddress }
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
        { rewardManagement: rewardManagementAddress }
      );
      return { data, error };
    } catch (error) {
      console.error(
        `Error fetching token transfers for reward management address: ${rewardManagementAddress}`,
        error
      );
      return { data: null, error };
    }
  }
  
  async getRewardManagementDisbursements(rewardManagementAddress: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        GetRewardManagementDisbursements,
        { rewardManagement: rewardManagementAddress }
      );
      return { data, error };
    } catch (error) {
      console.error(
        `Error fetching disbursements for reward management address: ${rewardManagementAddress}`,
        error
      );
      return { data: null, error };
    }
  }

  // reward sevice function
  async getRewards (){
try {
  const { data, error } = await this.subgraphQuery.query(GetRewards, {});
return { data, error };
}catch(error) {
    console.error('Error fetching rewards:', error);
    return { data: null, error };
}
  }


  async getRewardById(rewardRedemption: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(getRewardById, {rewardRedemption });
      return { data, error };
    } catch (error) {
      console.error('Error fetching reward by ID:', error);
      return { data: null, error };
    }
  }

    // service to get redeemed rewards
  async getRedeemedReward (rewardRedemption: string) {

try {
  const { data, error } = await this.subgraphQuery.query(GetRedeemedReward, {rewardRedemption});
return { data, error };
}catch(error) {
    console.error('Error fetching rewards:', error);
    return { data: null, error };
}
  } 

  //service to get redeemed rewards by participant address
  async getRedeemedRewardsByParticipant(participantAddress: string) {
    try {
      const { data, error } = await this.subgraphQuery.query(
        GetRedeemedRewardsByParticipant,
        { participant: participantAddress }
      );
      return { data, error };
    } catch (error) {
      console.error('Error fetching redeemed rewards by participant:', error);
      return { data: null, error };
    }
  }

  //get all the whitelisted participants 
  async getWhitelistedParticipants() {
    try {
      const { data, error } = await this.subgraphQuery.query(
        getParticipantWhiteListed,
        {}
      );
      return { data, error };
    } catch (error) {
      console.error('Error fetching whitelisted participants:', error);
      return { data: null, error };
    }
  }
}





