import { Cuid } from "@/components/departments/details/details.main";
import { PATHS } from "@/routes/paths";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { ArrowLeft } from "lucide-react";
import ParticipantCard from "./details.card";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type ParticipantDetailsProps = {
  cuid: Cuid;
  router: AppRouterInstance;
};

const ParticipantDetails = ({ router }: ParticipantDetailsProps) => {
  return (
    <main className="gap-2 p-4 sm:px-8 md:gap-8">
      <div
        onClick={() => router.push(PATHS.PARTICIPANT.HOME)}
        className="flex items-center gap-2 cursor-pointer hover:text-gray-400"
      >
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="font-base text-gray-700">Back</span>
      </div>
      <div className="flex flex-col gap-1 my-2">
        <h1 className="font-bold text-4xl">Rahat Consulting</h1>
        <h3 className="text-gray-500 font-normal text-sm">
          Detailed view of the selected department
        </h3>
      </div>

      <Tabs defaultValue="departmentOverview" className="mt-5">
        <div className="w-[400px]">
          <TabsList className="flex bg-blue-50 h-10">
            <TabsTrigger value="departmentOverview" className="w-full h-8">
              Department Overview
            </TabsTrigger>
            <TabsTrigger value="allocationHistory" className="w-full h-8">
              Allocation History
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="w-full mt-5">
          <TabsContent className="w-full" value="departmentOverview">
            <ParticipantCard />
          </TabsContent>
          <TabsContent className="w-full" value="allocationHistory">
            {/* <DepartmentDetailsTable
              table={table}
              columns={columns}
              setPagination={setPagination}
              pagination={pagination}
            /> */}
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
};

export default ParticipantDetails;
