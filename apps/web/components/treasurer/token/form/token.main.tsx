import { PATHS } from "@/routes/paths";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import TokenCreateForm from "./token.create";

interface TokenCreateMainProps {
  router: AppRouterInstance;
}

const TokenCreateMain = ({ router }: TokenCreateMainProps) => {
  return (
    <main className="gap-2 p-4 sm:px-8 md:gap-8 w-full">
      <div
        onClick={() => router.push(PATHS.TREASURER.TOKEN.HOME)}
        className="flex items-center gap-2 cursor-pointer hover:text-gray-400 "
      >
        <ArrowLeft size={24} strokeWidth={2} />
        <span className="font-base text-gray-700">Back</span>
      </div>
      <div className="flex flex-col gap-1 my-2">
        <h1 className="font-bold text-4xl">Create Token</h1>
        <h3 className="text-gray-500 font-normal text-sm">
          Fill the form below to create token details
        </h3>
      </div>

      <div className="w-[400px] h-[150px] mt-4">
        <Card className="font-normal text-base h-40 flex flex-col w-full h-full">
          <CardHeader className="flex-grow">
            <CardTitle className="flex items-center p-0 mb-4">
              <span className="text-[#0F172A] tracking-wide">
                Available number of tokens
              </span>
            </CardTitle>
            <CardDescription className="flex items-center text-sm">
              <div className="h-4"></div>
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
            23,000
          </CardFooter>
        </Card>
      </div>

      <TokenCreateForm />
    </main>
  );
};

export default TokenCreateMain;
