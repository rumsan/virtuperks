import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { CircleCheckBig, CircleDashed } from "lucide-react";

const TaskListStatus = ({ router }: any) => {
  return (
    <div className="flex items-center w-full">
      <div className="grid grid-cols-3 gap-4">
        <Card className="w-[320px] font-normal">
          <CardHeader className="p-3">
            <CardTitle className="flex text-base">
              <span className="text-sm tracking-wide">Tasks Pending</span>
              <CircleDashed className="justify-end ml-auto" size={20} />
            </CardTitle>
          </CardHeader>
          <CardDescription className="p-3 text-2xl text-primary font-bold">
            <span>10</span>
          </CardDescription>
        </Card>

        <Card className="w-[320px] font-normal">
          <CardHeader className="p-3">
            <CardTitle className="flex text-base">
              <span className="text-sm tracking-wide">Tasks Completed</span>
              <CircleCheckBig className="justify-end ml-auto" size={20} />
            </CardTitle>
          </CardHeader>
          <CardDescription className="p-3 font-normal text-2xl text-primary font-bold">
            <span>5</span>
          </CardDescription>
        </Card>

        <Card className="w-[320px] font-normal">
          <CardHeader className="p-3">
            <CardTitle className="flex text-base">
              <span className="text-sm tracking-wide">Total Task Created</span>
              <CircleDashed className="justify-end ml-auto" size={20} />
            </CardTitle>
          </CardHeader>
          <CardDescription className="p-3 font-normal text-2xl text-primary font-bold">
            <span>15</span>
          </CardDescription>
        </Card>
      </div>
    </div>
  );
};

export default TaskListStatus;
