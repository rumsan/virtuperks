"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

import { AccessManager } from "@/abis/AccessManager";
import { PATHS } from "@/routes/paths";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { keccak256, toBytes } from "viem";
import { useWriteContract } from "wagmi";
import DepartmentBaseForm from "./department.form";
import { departmentSchema } from "./schema";

const defaultValues: any = {
  name: "",
  //owner: "",
  walletAddress: "",
};

type DepartmentAddProps = {
  router: any;
};
const AccessManagerAddress = "0x50D75C1BC6a1cE35002C9f92D0AF4B3684aa6B74";

export default function DepartmentAdd({ router }: DepartmentAddProps) {
  const form = useForm({
    resolver: zodResolver(departmentSchema()),
    defaultValues: defaultValues,
  });

  const { data: hash, writeContract } = useWriteContract();

  const handleDepartmentSubmit = async (data: any) => {
    const appId = keccak256(toBytes(data.name));

    const adminAddress = "0x959FD7Ef9089B7142B6B908Dc3A8af7Aa8ff0FA1";

    writeContract({
      address: AccessManagerAddress,
      abi: AccessManager,
      functionName: "createApp",
      args: [appId, adminAddress],
    });
  };

  return (
    <>
      {" "}
      <div className="w-full items-center ">
        <main className="gap-2 p-4 sm:px-8 md:gap-8 w-full">
          <div
            onClick={() => router.push(PATHS.DEPARTMENT.HOME)}
            className="flex items-center gap-2 cursor-pointer hover:text-gray-400"
          >
            <ArrowLeft size={24} strokeWidth={2} />
            <span className="font-base text-gray-700">Back</span>
          </div>
          <div className="flex flex-col gap-1 my-2">
            <h1 className="font-bold text-4xl">Add Department</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              Fill the form below to create a new department
            </h3>
          </div>

          <div className="my-6">
            <Card className="rounded-lg w-full">
              <CardContent className="p-0">
                <DepartmentBaseForm
                  mode="add"
                  form={form}
                  defaultValues={defaultValues}
                  saveForm={handleDepartmentSubmit}
                >
                  <div className="flex justify-end gap-4">
                    <Button
                      variant="outline"
                      type="button"
                      className="w-[170px] flex justify-center items-center gap-2"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        history.back();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="default"
                      className="w-[170px] flex justify-center items-center gap-2"
                    >
                      Create
                    </Button>
                  </div>
                </DepartmentBaseForm>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
