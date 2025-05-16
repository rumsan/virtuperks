import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Coins, Folders, User } from "lucide-react";

const TokenAllocateCard = () => {
  return (
    <div className="flex items-center w-full mt-3 gap-4">
      <Card className="font-normal text-base h-40 flex flex-col w-full">
        <CardHeader className="flex-grow">
          <CardTitle className="flex items-center p-0 mb-4">
            <span className="text-[#0F172A] tracking-wide">
              Department Owner
            </span>
            <div className="ml-auto">
              <User color="#334155" />
            </div>
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex items-center text-[#297AD6] text-2xl font-bold">
          Ram Thapa Magar
        </CardFooter>
      </Card>

      <Card className="font-normal text-base h-40 flex flex-col w-full">
        <CardHeader className="flex-grow">
          <CardTitle className="flex items-center p-0 mb-4">
            <span className="text-[#0F172A] tracking-wide">
              Overall Tokens Allocated
            </span>
            <div className="ml-auto">
              <Coins color="#334155" />
            </div>
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
          23,000
        </CardFooter>
      </Card>

      <Card className="font-normal text-base h-40 flex flex-col w-full">
        <CardHeader className="flex-grow">
          <CardTitle className="flex items-center p-0 mb-4">
            <span className="text-[#0F172A] tracking-wide">
              Available Tokens
            </span>
            <div className="ml-auto">
              <Coins color="#334155" />
            </div>
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
          10,000
        </CardFooter>
      </Card>

      <Card className="font-normal text-base h-40 flex flex-col w-full">
        <CardHeader className="flex-grow">
          <CardTitle className="flex items-center p-0 mb-4">
            <span className="text-[#0F172A] tracking-wide">Group</span>
            <div className="ml-auto">
              <Folders color="#334155" />
            </div>
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
          Rumsan
        </CardFooter>
      </Card>
    </div>
  );
};

export default TokenAllocateCard;
