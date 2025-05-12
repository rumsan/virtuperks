import { PATHS } from "@/routes/paths";
import { ArrowLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import DepartmentTokenAllocate from "./token.allocate";
import TokenAllocateCard from "./token.card";

interface TokenAllocateMainProps {
  router: AppRouterInstance;
}

const TokenAllocateMain = ({ router }: TokenAllocateMainProps) => {
  return (
    <main className="gap-2 p-4 sm:px-8 md:gap-8 w-full">
      <div
        onClick={() => router.push(PATHS.TREASURER.HOME)}
        className="flex items-center gap-2 cursor-pointer hover:text-gray-400 "
      >
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="font-base text-gray-700">Back</span>
      </div>
      <div className="flex flex-col gap-1 my-2">
        <h1 className="font-bold text-4xl">Allocate Tokens</h1>
        <h3 className="text-gray-500 font-normal text-sm">
          Fill the form below to assign token to the selected department
        </h3>
      </div>

      <TokenAllocateCard />

      <DepartmentTokenAllocate />
    </main>
  );
};

export default TokenAllocateMain;
