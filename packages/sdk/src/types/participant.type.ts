import { CommonFields } from "./common.type";
import { EntityTaskManagerCreated } from './entity.type';
import { TaskDetail } from "./taskDetail.type";




export type TaskData = CommonFields & {
  id: string;
  internal_id: string;
  createdBy: string;
  entityTaskManager: EntityTaskManagerCreated;
};


export interface ParticipantTaskStatus extends CommonFields {
  id: string;
  participant: string;
  taskId: string;
  status: "UNACCEPTED" | "ACCEPTED" | "COMPLETED" | "VERIFIED";
  lastUpdatedBlock: string;
  lastUpdatedTimestamp: string;
  taskDetail: TaskDetail & {
    task: TaskData;
  };
}
