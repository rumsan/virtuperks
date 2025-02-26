import { Card } from "@workspace/ui/components/card";
import { Copy, User } from "lucide-react";

const TreasurerCard = () => {
  return (
    <div className="flex items-center gap-4 mt-5 mb-5 h-[120px]">
      <div className="w-[350px] h-full">
        <Card className="flex items-center p-4 gap-4 h-full">
          <div className="rounded-full flex p-3 bg-[#475263] mb-auto">
            <User color="#fff" />
          </div>

          <div className="flex flex-col">
            <div className="font-bold text-xl text-[#334155]">Ram Shrestha</div>
            <div className="text-[#64748B] font-normal text-base">
              Treasurer
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#64748B] font-normal text-base">
                xx778x9873398738x9
              </span>{" "}
              <Copy size={16} strokeWidth={3} color="#94A3B8" />
            </div>
          </div>
        </Card>
      </div>

      <div className="w-[350px] h-full">
        <Card className="flex flex-col items-center p-4 gap-4 h-full">
          <div className="flex items-center w-full">
            <span className="text-[#0F172A] font-bold">
              Total Tokens Created
            </span>
          </div>
          <div className="flex items-center mr-auto w-full mt-4">
            <span className="text-[#297AD6] font-bold text-2xl">10,000</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TreasurerCard;
