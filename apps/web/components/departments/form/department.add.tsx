"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

import { PATHS } from "@/routes/paths";
import { EntityFactoryABI } from "@workspace/contracts/abis";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useWriteContract } from "wagmi";
import DepartmentBaseForm from "./department.form";
import { Department, departmentSchema } from "./schema";

const defaultValues: Department = {
  name: "",
};

type DepartmentAddProps = {
  router: any;
};

export default function DepartmentAdd({ router }: DepartmentAddProps) {
  const form = useForm({
    resolver: zodResolver(departmentSchema()),
    defaultValues: defaultValues,
  });

  const { data, writeContractAsync } = useWriteContract();

  const createEntityButton = async (data: Department) => {
    console.log(data, "inside data");
    const appId = process.env.NEXT_PUBLIC_APP_ID;
    await writeContractAsync({
      address:
        (process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`) || "0x ",
      abi: EntityFactoryABI,
      functionName: "createEntityTaskManager",
      args: [process.env.NEXT_PUBLIC_ACCESSMANAGER, appId, data.name],
    });

    router.push(PATHS.DEPARTMENT.HOME);
  };

  return (
    <>
      {" "}
      <div className="w-full items-center ">
        <main className="gap-2 p-2 sm:px-6 sm:py-1 md:gap-8 w-full">
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
                  saveForm={createEntityButton}
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
