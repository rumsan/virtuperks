import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Coins } from "lucide-react";

const TokenCard = () => {
  return (
    <div className="flex items-center w-full mt-3 gap-4">
      <div className="w-[350px]">
        <Card className="font-normal text-base h-40 flex flex-col w-full">
          <CardHeader className="flex-grow">
            <CardTitle className="flex items-center p-0 mb-4">
              <span className="text-[#0F172A] tracking-wide">
                Tokens Created
              </span>
              <div className="ml-auto">
                <Coins color="#334155" />
              </div>
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

      <div className="w-[350px]">
        <Card className="font-normal text-base h-40 flex flex-col w-full">
          <CardHeader className="flex-grow">
            <CardTitle className="flex items-center p-0 mb-4">
              <span className="text-[#0F172A] tracking-wide">
                Tokens Allocated
              </span>
              <div className="ml-auto">
                <Coins color="#334155" />
              </div>
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
    </div>
  );
};

export default TokenCard;
