import { DialogButton } from "@/components/common/ui/dialog";
import { useGetEntityById } from "@/hooks/subgraph/entity";
import { useDirectTokenTransfer } from "@/hooks/subgraph/token";
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
import { toast } from "@workspace/ui/hooks/use-toast";
import { CheckCircle, Copy, Plus, User } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { Cuid } from "./details.main";

type DepartmentDetailsCardProps = {
  cuid: Cuid;
  router: AppRouterInstance;
};

export default function DepartmentDetailsCard({
  cuid,
  router,
}: DepartmentDetailsCardProps) {
  console.log("CUID Department: ", cuid.id);

  const { data: entity, isLoading, isError, error } = useGetEntityById(cuid.id);
  console.log("Entity ID: ", entity);

  const {
    directTransfer,
    directTransferPending,
    directTransferSuccess,
    directTransferError,
  } = useDirectTokenTransfer();

  const [isOpen, setIsOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState<string | null>(null);

  if (isLoading) {
    return <p className="text-gray-600">Loading department info...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-600">Failed to load department: {error.message}</p>
    );
  }

  if (!entity) {
    return (
      <p className="text-red-600">
        Department data is not available or could not be found.
      </p>
    );
  }

  const handleDialogAction = async (data: any) => {
    try {
      await directTransfer({
        to: data.to,
        amount: data.amount,
        remarks: data.remarks,
        entityId: entity.id,
      });
      setIsOpen(false);
      setLocalStatus("DISPERSE");
      toast({
        title: "Token transfered Successfully!.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error approving transfering token:", error);
      toast({
        title: "Failed To transfer token. Please Try Again.",
        variant: "destructive",
      });
    }
  };

  const roleCheck = hasRole({
    role: process.env.NEXT_PUBLIC_MINTER_ROLE || "",
  });
  const hasTreasurerRole = typeof roleCheck === "boolean" ? roleCheck : false;

  return (
    <>
      <div className="flex flex-col gap-1 my-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-4xl">{entity.name}</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              Detailed view of the selected department
            </h3>
          </div>
          {hasTreasurerRole && (
            <div className="flex gap-10">
              <Button
                variant="outline"
                className="h-12 w-48 flex items-center justify-center"
                style={{
                  border: "1px solid #03AB65",
                }}
                onClick={() => setIsOpen(true)}
              >
                {!directTransferPending && isOpen && (
                  <DialogButton
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    title="Are you sure you want to transfer token amount?"
                    subTitle="This action cannot be undone"
                    buttonName="Transfer Token"
                    submitType="directdisburse"
                    handleApplyTaskLogic={handleDialogAction}
                  />
                )}
                <span className="text-[#03AB65]">Disburse Tokens</span>
                <CheckCircle
                  className="ml-2"
                  style={{
                    color: "#03AB65",
                    strokeWidth: 2.5,
                    width: "20px",
                    height: "20px",
                  }}
                />
              </Button>

              <Button
                className="h-12 w-48 fw-[600] flex items-center justify-center"
                variant="default"
                type="button"
                onClick={() =>
                  router.push(PATHS.TREASURER.CREATE(entity.rewardManagement))
                }
              >
                <Plus size={22} strokeWidth={2.75} />
                <span className="ml-2">Allocate Token</span>
              </Button>
            </div>
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
                  {entity.name}
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
            {entity.totalTokenBalance ?? "-"}
          </CardFooter>
        </Card>
        <Card className="font-normal text-base h-40 flex flex-col">
          <CardHeader className="flex-grow">
            <CardTitle className="flex p-0 mb-4 text-[#0F172A]">
              Total Tokens Available
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            {entity.remainingTokenBalance ?? "-"}
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
