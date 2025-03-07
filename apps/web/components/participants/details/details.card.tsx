import { Card, CardTitle } from "@workspace/ui/components/card";
import { Copy, Dot, User } from "lucide-react";

const ParticipantCard = () => {
  return (
    <div className="grid grid-cols-3 w-full gap-4 h-[250px]">
      <Card className="p-2 w-full h-[250px]">
        <div className="">
          <CardTitle className="flex items-center text-base font-normal p-1">
            <span className="font-bold">Participant</span>
            <span className="flex items-center text-center justify-center text-sm justify-end h-6 w-20 ml-auto bg-gray-100 rounded-2xl p-1 text-gray-600">
              Owner
            </span>
          </CardTitle>
        </div>

        <div className="items-center justify-center mt-5">
          <div className="flex items-center justify-center m-auto h-[75px] w-[80px] bg-gray-600 border rounded-xl">
            <User size={28} strokeWidth={1.5} color="#fff" />
          </div>
          <div className="flex items-center justify-center gap-2 text-sm mt-4">
            <span className="text-base font-bold text-lg">Ram Shrestha</span>
            <span className="text-gray-500 text-sm">Male</span>
          </div>
          <div className="w-full flex items-center justify-center text-sm">
            <span className="text-gray-600">hello@gmail.com</span>
            <span className="text-gray-600">
              <Dot />
            </span>
            <span className="text-gray-600">0x00e8hfh3993db3ni</span>
            <span className="ml-2">
              <Copy className="text-gray-500" size={16} strokeWidth={2.75} />
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
            <span>Manager:</span>
            <span>Manager A</span>
          </div>
        </div>
      </Card>

      <Card className="p-2 w-full h-[250px]">
        <div className="flex items-center w-full h-[60%]">
          <CardTitle className="w-[60%] h-full flex flex-col p-1">
            <span className="text-base">Total Tokens Created</span>
            <span className="text-2xl font-bold text-primary mt-2">10,000</span>
          </CardTitle>
          <div className="flex items-center justify-center w-[50%] h-full"></div>
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

      <Card className="p-2 w-full h-[250px]">
        <div className="w-full">
          <CardTitle className="p-1">
            <span>Allocation Chart</span>
          </CardTitle>
        </div>
        <div className="w-full"></div>
      </Card>
    </div>
  );
};

export default ParticipantCard;
