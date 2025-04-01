import { CommonFields } from "./common.type";
import { EntityTaskManagerCreated } from "./entity.type";
import { TaskDetail } from "./taskDetail.type";







export interface AcceptedTaskData extends CommonFields {
  id: string;
  internal_id: string;
  participant: string;
  status: string;
  taskDetail: TaskDetail & {
    allowedWallets: string[];
    __typename: string;
  };
}


export type TaskCreated = CommonFields & {
  createdBy?: string;
  entityTaskManager?: EntityTaskManagerCreated;
  id?: string;
  internal_id: string;
  taskDetail: TaskDetail;
};

