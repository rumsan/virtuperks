"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import DepartmentBaseForm from "./department.form";
import { Department, departmentSchema } from "./schema";

type ExpenseEditProps = {
  router: any;
};

export default function DepartmentEdit({ router }: ExpenseEditProps) {
  const defaultValues: Department = {
    name: "Hello Hello",
    owner: "A",
    walletAddress: "0x0ehfrhf94840t05059n",
  };

  const form = useForm<Department>({
    resolver: zodResolver(departmentSchema()),
    defaultValues: defaultValues,
  });

  const handleDepartmentSubmit = async (data: any) => {
    console.log(data, "data");
  };

  return (
    <>
      {" "}
      <div className="w-full items-center ">
        <main className="gap-2 p-4 sm:px-8 md:gap-8 w-full">
          <div className="flex items-center gap-2">
            <ArrowLeft size={24} strokeWidth={2} />
            <span className="font-base text-gray-700">Back</span>
          </div>
          <div className="flex flex-col gap-1 my-2">
            <h1 className="font-bold text-4xl">Edit Department</h1>
            <h3 className="text-gray-500 font-normal text-sm">
              You can make changes to the fields below
            </h3>
          </div>

          <div className="my-6">
            <Card className="rounded-lg w-full">
              <CardContent className="p-0">
                <DepartmentBaseForm
                  mode="edit"
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
                      Update
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
