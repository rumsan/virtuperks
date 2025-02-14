"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

import { PATHS } from "@/routes/paths";
import { deployEntityTaskManager } from "@/utils/ethers";
import { useEthersSigner } from "@/utils/etherSigner";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
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
const accessManagerContract = "0x50D75C1BC6a1cE35002C9f92D0AF4B3684aa6B74";

export default function DepartmentAdd({ router }: DepartmentAddProps) {
  const form = useForm({
    resolver: zodResolver(departmentSchema()),
    defaultValues: defaultValues,
  });

  const signer = useEthersSigner({ chainId: 8545 });

  //const { data: hash, writeContract } = useWriteContract();
  //way to call the function of the deployed contract
  // const handleDepartmentSubmit = async (data: any) => {
  //   const appId = keccak256(toBytes(data.name));

  //   const adminAddress = "0x959FD7Ef9089B7142B6B908Dc3A8af7Aa8ff0FA1";

  //   writeContract({
  //     address: AccessManagerAddress,
  //     abi: AccessManager,
  //     functionName: "createApp",
  //     args: [appId, adminAddress],
  //   });
  // };
  const createEntityButton = async () => {
    if (!signer) {
      alert("Signer is not available");
      return;
    }
    const appId =
      "0x87c3aefca89371d66a3eb9d8a8b7866fad1000286f175d57d502b71d34b7e7bd";
    const deployContract = await deployEntityTaskManager(
      signer,
      accessManagerContract,
      appId,
    );
  console.log(deployContract, "deployContractfrom component");
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
