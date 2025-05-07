import { useEntityDetailById } from "@/hooks/subgraph/querycall";
import { PATHS } from "@/routes/paths";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Copy, Plus, User } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Cuid } from "./details.main";

type DepartmentDetailsCardProps = {
  cuid: Cuid;
  router: AppRouterInstance;
};

export default function DepartmentDetailsCard({
  cuid,
  router,
}: DepartmentDetailsCardProps) {
  const getEntity = useEntityDetailById(cuid.id);
  const data = getEntity?.data?.data?.entityTaskManagerCreateds[0];

  return (
    <>
      <div className="flex flex-col gap-1 my-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-4xl">{data?._name}</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              Detailed view of the selected department
            </h3>
          </div>
          <Button
            className="min-w-[10rem] fw-[600] h-10 ml-auto"
            variant="default"
            type="submit"
            onClick={() => router.push(PATHS.TREASURER.CREATE)}
          >
            <Plus size={22} strokeWidth={2.75} />
            <span>Allocate Token</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 mt-4 gap-4 w-full">
        <Card className="font-normal text-base h-40 flex flex-col p-4">
          <CardTitle className="flex items-center gap-3">
            <div className="rounded-full flex p-3 bg-[#475263] mb-auto">
              <User color="#fff" />
            </div>

            <CardDescription className="flex flex-col gap-2">
              <div className="flex flex-col items-start gap-2">
                <div className="flex flex-start text-[#334155] text-xl justify-start">
                  {data?._name}
                </div>
                <div className="flex flex-start text-[#64748B] text-base font-normal">
                  {/* <span>Department Owner</span> */}
                </div>

                <div className="flex items-center gap-1">
                  {/* <span className="text-[#64748B] font-normal text-base">
                  xx778x9873398738x9
                </span>{" "} */}
                  <Copy size={16} strokeWidth={3} color="#94A3B8" />
                </div>
              </div>
            </CardDescription>
          </CardTitle>
        </Card>

        <Card className="font-normal text-base h-40 flex flex-col">
          <CardHeader className="flex-grow">
            <CardTitle className="flex p-0 mb-4">
              <span className="text-[#0F172A]">Total Tokens Allocated</span>
            </CardTitle>
            <CardDescription className="flex items-center text-sm">
              <div className="h-4"></div>
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {data?.totalTokenBalance}
          </CardFooter>
        </Card>

        <Card className="font-normal text-base h-40 flex flex-col">
          <CardHeader className="flex-grow">
            <CardTitle className="flex p-0 mb-4">
              <span className="text-[#0F172A]">Total Tokens Available</span>
            </CardTitle>
            <CardDescription className="flex items-center text-sm">
              <div className="h-4"></div>
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {data?.remainingBalance}
          </CardFooter>
        </Card>

        <Card className="font-normal text-base h-40 flex flex-col">
          <CardHeader className="flex-grow">
            <CardTitle className="flex p-0 mb-4">
              <span className="text-[#0F172A]">Total Tokens Redeemed</span>
            </CardTitle>
            <CardDescription className="flex items-center text-sm">
              <div className="h-4"></div>
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            -
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
