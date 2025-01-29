import {Client} from '@urql/core';
import {
  ApprovalList,
  CreatedAppList,
  ParticiantAppliedList,
  RoleGrantedList,
  TaskCreatedList,
  TransferList,
} from '../queries';

export class SubgraphService {
  private subgraphQuery: Client;

  constructor(client: Client) {
    this.subgraphQuery = client;
  }

  async getAppCreatedlist() {
    const {data, error} = await this.subgraphQuery.query(CreatedAppList, {});
    return {data, error};
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
}
