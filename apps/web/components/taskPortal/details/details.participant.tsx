import { participantList } from "@/sampleData";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { User } from "lucide-react";
import { useState } from "react";

const TaskPortalParticipant = ({ router }: any) => {
  const [hoveredWallet, setHoveredWallet] = useState<string | null>(null);
  return (
    <>
      {/* <Card className="w-[80%] h-full p-4"></Card> */}

      <Card className="w-[20%] ml-auto p-4">
        <CardTitle className="flex flex-col gap-2 w-full">
          <span>Participants</span>
          <span className="text-sm text-gray-500 font-normal">
            List of all the participants in this task
          </span>
        </CardTitle>

        <div className="flex items-center w-full mt-5 mb-5 gap-2 flex-wrap">
          {participantList.map((participant) => (
            <div
              key={participant.walletAddress}
              className="relative flex items-center justify-center h-8 w-8 rounded-full bg-[#F1F5F9] gap-4 cursor-pointer hover:bg-gray-50"
              onMouseEnter={() => setHoveredWallet(participant.walletAddress)}
              onMouseLeave={() => setHoveredWallet(null)}
            >
              <User color="#64748B" size={20} />

              {hoveredWallet === participant.walletAddress && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#297AD6] text-[#F8FAFC] text-xs px-2 py-1 rounded-md shadow-md">
                  {participant.walletAddress}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default TaskPortalParticipant;
