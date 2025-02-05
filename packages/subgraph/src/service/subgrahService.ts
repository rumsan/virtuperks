// import { cacheExchange, Client, fetchExchange } from '@urql/core'
//import {cacheExchange, Client, fetchExchange} from '@urql/core';
import {Client} from 'urql';
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

  constructor(graphurl: Client) {
    console.log(graphurl, 'client from queries');
    this.subgraphQuery = graphurl;
  }

  async getAppCreatedlist() {
    try {
      console.log('do i reach here');
      console.log(this.subgraphQuery, 'subgraphClient');
      console.log(CreatedAppList, 'CreatedAppList');
      const data = await this.subgraphQuery.query(CreatedAppList, {id: 1});

      console.log(data, 'data form service file');
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
}
