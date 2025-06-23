"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

import { PATHS } from "@/routes/paths";
// import { EntityFactoryABI } from "@workspace/contracts/abis";
import { useDepartmentAdd } from "@/hooks/subgraph/entity";
import { ArrowLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useWriteContract } from "wagmi";
import DepartmentBaseForm from "./department.form";
import { Department, departmentSchema } from "./schema";
import { createId } from "@paralleldrive/cuid2";
import { keccak256 } from "viem";
import { toUtf8Bytes } from "ethers";

const defaultValues: Department = {
  name: "",
  entityOwners: [],
};

type DepartmentAddProps = {
  router: AppRouterInstance;
};

export default function DepartmentAdd({ router }: DepartmentAddProps) {
  const form = useForm({
    resolver: zodResolver(departmentSchema()),
    defaultValues: defaultValues,
  });

  const { writeContractAsync, isPending, isSuccess, isError, error } =
    useWriteContract();

  // Handle success and redirect
  useEffect(() => {
    if (isSuccess) {
      router.push(PATHS.DEPARTMENT.HOME);
    }
  }, [isSuccess, router]);

  // Handle error with console log
  useEffect(() => {
    if (isError && error) {
      console.error("Transaction failed:", error);
    }
  }, [isError, error]);
  const { departmentAdd, departmentPending, departmentSuccess } =
    useDepartmentAdd();

  const createEntityButton = async (data: Department) => {
    if (departmentPending) return;
    try {
     
      departmentAdd( data);
    } catch (err) {
      console.error("Failed to create entity:", err);
    }
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
                      disabled={departmentPending}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      variant="default"
                      className="w-[170px] flex justify-center items-center gap-2"
                      disabled={departmentPending}
                    >
                      {departmentPending ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Create"
                      )}
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
