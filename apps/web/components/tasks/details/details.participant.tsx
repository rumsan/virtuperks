import { Card } from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";

const TaskParticipant = ({ router }: any) => {
  return (
    <Card>
      <div className="flex items-center">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-xl">Task List</h1>
          <h3 className="text-gray-500 font-normal text-sm">
            List of all the tasks
          </h3>
        </div>
      </div>

      <Tabs defaultValue="active" className="">
        <div className="w-[400px]">
          <TabsList className="flex bg-blue-50 h-10">
            <TabsTrigger value="active" className="w-full h-8">
              Active
            </TabsTrigger>
            <TabsTrigger value="completed" className="w-full h-8">
              Completed
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="w-full mt-5 mb-5">
          <TabsContent className="w-full" value="active">
            {/* <ListCardDetails taskList={TaskList} router={router} /> */}
          </TabsContent>
          <TabsContent className="w-full" value="completed"></TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default TaskParticipant;
