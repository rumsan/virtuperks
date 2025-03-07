import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Copy, User } from "lucide-react";

const TreasurerCard = () => {
  return (
    <div className="grid grid-cols-4 mt-4 gap-4 w-full">
      <Card className="font-normal text-base h-40 flex flex-col p-4">
        <CardTitle className="flex items-center gap-3">
          <div className="rounded-full flex p-3 bg-[#475263] mb-auto">
            <User color="#fff" />
          </div>

          <CardDescription className="flex flex-col gap-2">
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-start text-[#334155] text-xl justify-start">
                Ram Thapa Magar
              </div>
              <div className="flex flex-start text-[#64748B] text-base font-normal">
                <span>Treasurer</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[#64748B] font-normal text-base">
                  xx778x9873398738x9
                </span>{" "}
                <Copy size={16} strokeWidth={3} color="#94A3B8" />
              </div>
            </div>
          </CardDescription>
        </CardTitle>
      </Card>

      <Card className="font-normal text-base h-40 flex flex-col">
        <CardHeader className="flex-grow">
          <CardTitle className="flex p-0 mb-4">
            <span className="text-[#0F172A]">Total Tokens Created</span>
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
  );
};

export default TreasurerCard;
