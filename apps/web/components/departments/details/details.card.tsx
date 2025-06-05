import { useGetEntityById } from "@/hooks/subgraph/entity";
import { PATHS } from "@/routes/paths";
import hasRole from "@/utils/role";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Copy, Plus, User } from "lucide-react";

type DepartmentDetailsCardProps = {
  cuid: Cuid;
  router: AppRouterInstance;
};

export default function DepartmentDetailsCard({
  cuid,
  router,
}: DepartmentDetailsCardProps) {
  const { data, isLoading, isError, error } = useGetEntityById(cuid.id);
  console.log("Data: ", data);
  if (isLoading) {
    return <p className="text-gray-600">Loading department info...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-600">Failed to load department: {error.message}</p>
    );
  }

  const entity = data;

  console.log("Entity: ", entity);
  const roleCheck = hasRole({
    role: process.env.NEXT_PUBLIC_MINTER_ROLE || "",
  });
  const hasTreasurerRole = typeof roleCheck === "boolean" ? roleCheck : false;

  return (
    <>
      <div className="flex flex-col gap-1 my-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-4xl">{entity?.name}</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              Detailed view of the selected department
            </h3>
          </div>
          {hasTreasurerRole && (
            <Button
              className="min-w-[10rem] fw-[600] h-10 ml-auto"
              variant="default"
              type="button"
              onClick={() => router.push(PATHS.TREASURER.CREATE(entity.id))}
            >
              <Plus size={22} strokeWidth={2.75} />
              <span>Allocate Token</span>
            </Button>
          )}
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
                  {/* {entity?.name} */}
                </div>
                <div className="flex items-center gap-1">
                  <Copy size={16} strokeWidth={3} color="#94A3B8" />
                </div>
              </div>
            </CardDescription>
          </CardTitle>
        </Card>

        <Card className="font-normal text-base h-40 flex flex-col">
          <CardHeader className="flex-grow">
            <CardTitle className="flex p-0 mb-4 text-[#0F172A]">
              Total Tokens Allocated
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {entity?.totalTokenBalance ?? "-"}
          </CardFooter>
        </Card>
        <Card className="font-normal text-base h-40 flex flex-col">
          <CardHeader className="flex-grow">
            <CardTitle className="flex p-0 mb-4 text-[#0F172A]">
              Total Tokens Available
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {entity?.remainingTokenBalance ?? "-"}
          </CardFooter>
        </Card>
        <Card className="font-normal text-base h-40 flex flex-col">
          <CardHeader className="flex-grow">
            <CardTitle className="flex p-0 mb-4 text-[#0F172A]">
              Total Tokens Redeemed
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            -
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
