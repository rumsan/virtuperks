import {cacheExchange, Client, fetchExchange} from '@urql/core';

import {
  ApprovalList,
  //ApprovalList,
  CreatedAppList,
  EntityTaskManagerCreatedList,
  ParticiantAppliedList,
  RoleGrantedList,
  TaskAcceptedList,
  TaskCompletedList,
  TaskCreatedList,
  TransferList,
} from '../queries';

export class SubgraphService {
  private subgraphQuery: Client;

  constructor(graphurl: string) {
    this.subgraphQuery = new Client({
      url: graphurl,
      exchanges: [cacheExchange, fetchExchange],
    });
  }

  async getAppCreatedlist() {
    try {
      const data = await this.subgraphQuery.query(CreatedAppList, {});

      return {data};
    } catch (error) {
      console.log(error, 'error');
    }
  }

  async getRoleGrantedList() {
    const {data, error} = await this.subgraphQuery.query(RoleGrantedList, {});
    return {data, error};
  }

  async getApprovalList() {
    const {data, error} = await this.subgraphQuery.query(ApprovalList, {});
    return {data, error};
  }
  async getTransferList() {
    const {data, error} = await this.subgraphQuery.query(TransferList, {});
    return {data, error};
  }

  async getTaskCreatedList() {
    const {data, error} = await this.subgraphQuery.query(TaskCreatedList, {});
    return {data, error};
  }

  async getParticiantAppliedList() {
    const {data, error} = await this.subgraphQuery.query(
      ParticiantAppliedList,
      {},
    );
    return {data, error};
  }
  async getEntityManagerCreatedList() {
    const {data, error} = await this.subgraphQuery.query(
      EntityTaskManagerCreatedList,
      {},
    );
    return {data, error};
  }

  async getTaskAcceptedList() {
    const {data, error} = await this.subgraphQuery.query(TaskAcceptedList, {});
    return {data, error};
  }

  async getTaskCompletedList() {
    const {data, error} = await this.subgraphQuery.query(TaskCompletedList, {});
    return {data, error};
  }
}
