import { Card, CardTitle } from "@workspace/ui/components/card";
import { Copy, User } from "lucide-react";
import { TreasurerChart } from "./details.chart";
import { TreasurerLineChart } from "./details.lineChart";

const TreasurerCard = () => {
  return (
    <div className="grid grid-cols-3 w-full gap-4">
      <Card className="p-2">
        <div className="p-2">
          <CardTitle className="flex text-base pl-2">Treasurer</CardTitle>
        </div>

        <div className="flex items-center justify-center m-auto h-[70px] w-[75px] bg-gray-600 border rounded-xl">
          <User size={28} strokeWidth={1.5} color="#fff" />
        </div>
        <div className="flex flex-col items-center justify-center gap-2 text-sm">
          <span className="text-base mt-1 font-bold">Ram Shrestha</span>
          <span className="text-gray-600 mt-0">
            0x00e8hfh3993db3ni{" "}
            <Copy className="text-gray-500" size={16} strokeWidth={2.75} />{" "}
          </span>
        </div>
      </Card>

      <Card className="p-2">
        <div className="flex items-center w-full h-[60%] p-2">
          <div className="w-[60%] h-full flex flex-col p-2">
            <span className="text-base">Total Tokens Created</span>
            <span className="text-2xl font-bold text-primary mt-2">10,000</span>
          </div>
          <div className="flex items-center justify-center w-[40%] h-full">
            <TreasurerChart />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 items-center w-full h-[40%]">
          <div className="w-full h-full flex flex-col bg-blue-100 rounded-lg p-3 gap-2">
            <span className="text-base">Remaining</span>
            <span className="font-bold ">8,000</span>
          </div>
          <div className="w-full h-full flex flex-col bg-green-100 rounded-lg p-3 gap-2">
            <span className="text-base">Allocated</span>
            <span className="font-bold">30,000</span>
          </div>
          <div className="w-full h-full flex flex-col bg-red-100 rounded-lg p-3 gap-2">
            <span className="text-base">Redeemed</span>
            <span className="font-bold">20,000</span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="w-full h-[100px]"> Allocation Chart</div>
        <div className="w-full">
          <TreasurerLineChart />
        </div>
      </Card>
    </div>
  );
};

export default TreasurerCard;
