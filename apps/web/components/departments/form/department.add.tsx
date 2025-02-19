"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

import { PATHS } from "@/routes/paths";
import { AccessManagerABI, EntityFactoryABI } from "@workspace/contracts/abis";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { keccak256 } from "viem";
import { useDeployContract, useWriteContract } from "wagmi";
import DepartmentBaseForm from "./department.form";
import { departmentSchema } from "./schema";

const defaultValues: any = {
  name: "",
 
  appId: "",
};

type DepartmentAddProps = {
  router: any;
};


export default function DepartmentAdd({ router }: DepartmentAddProps) {
  const form = useForm({
    resolver: zodResolver(departmentSchema()),
    defaultValues: defaultValues,
  });

  // const signer = useEthersSigner({ chainId: 8545 });
  const {deployContractAsync}= useDeployContract()

  const { data: hash, writeContract } = useWriteContract();
  //functin that call the createApp function in the accessManager contract
  //  const handleAppSubmit = async (data: any) => {
  // //  console.log(data,'data from form')
  //    const appId = keccak256(data.name);
  //    console.log(appId, 'appid')
  //    console.log(process.env.NEXT_PUBLIC_ACCESSMANAGER, 'accessmanager')
  //    console.log(AccessManagerABI, 'abi')
 

  //   writeContract({
  //     address: process.env.NEXT_PUBLIC_ACCESSMANAGER as `0x${string}` || '0x0000000000000000,',
  //     abi: AccessManagerABI,
  //     functionName: "createApp",
  //     args: [appId, process.env.NEXT_PUBLIC_ADMIN],
  //       //chainId of the network
  //   });
  // };
  const createEntityButton = async (data: any) => {
    console.log(data.appId,'appId')
 
    const appId =
      "0x2b56db881889710dae7660e2ab8f4d36e231cec73c9923c95f531a52fe704183";
  
    writeContract({
      address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}` || '0x ',
      abi: EntityFactoryABI,
      functionName: "createEntityTaskManager",
      args: [process.env.NEXT_PUBLIC_ACCESSMANAGER , data.appId, data.name],
   })

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
                  // saveForm={handleDepartmentSubmit}
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
