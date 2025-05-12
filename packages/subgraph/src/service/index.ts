import {Client, fetchExchange} from '@urql/core';

import {
  ApprovalList,
  CreatedAppList,
  EntityTaskManagerCreatedList,
  getAllParticipantsByRole,
  GetAllTasksForParticipant,
  getEntityDetailById,
  GetParticipantTaskStatusWithVariables,
  GetTaskApprovedAndCompleted,
  GetTaskDetailsById,
  GetTaskParticipantsWithStatus,
  RoleGrantedList,
  TaskCreatedList,
  TransferList,
} from '../queries';

export class SubgraphService {
  private subgraphQuery: Client;

  constructor(graphurl: string) {
    this.subgraphQuery = new Client({
      url: graphurl,
      exchanges: [fetchExchange],
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

  async getEntityManagerCreatedList() {
    const {data, error} = await this.subgraphQuery.query(
      EntityTaskManagerCreatedList,
      {},
    );
    return {data, error};
  }

  async getEntityDetailById(id: string) {
    const {data, error} = await this.subgraphQuery.query(getEntityDetailById, {
      id,
    });
    return {data, error};
  }

  async getParticipantTaskStatus(participant: string, taskId: string) {
    const {data, error} = await this.subgraphQuery.query(
      GetParticipantTaskStatusWithVariables,
      {participant, taskId},
    );
    return {data, error};
  }

  async getTaskParticipantsWithStatus(taskId: string) {
    const {data, error} = await this.subgraphQuery.query(
      GetTaskParticipantsWithStatus,
      {taskId},
    );
    return {data, error};
  }

  async getTaskApprovedAndCompletedList(taskId: string) {
    const {data, error} = await this.subgraphQuery.query(
      GetTaskApprovedAndCompleted,
      {taskId},
    );
    return {data, error};
  }

  async getTaskDetails(taskId: string) {
    const {data, error} = await this.subgraphQuery.query(GetTaskDetailsById, {
      taskId,
    });
    return {data, error};
  }

  async getAllParticipantsByRole(role: string) {
    try {
      const result = await this.subgraphQuery.query(getAllParticipantsByRole, {
        role,
      });

      const {data, error} = result;
      return {data, error};
    } catch (error) {
      console.error('Error fetching participants by role:', error);
      return {data: null, error};
    }
  }

  async getAllTaskByParticipant(participant: string) {
    const {data, error} = await this.subgraphQuery.query(
      GetAllTasksForParticipant,
      {participant},
    );
    return {data, error};
  }
}
