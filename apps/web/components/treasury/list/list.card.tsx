import { PATHS } from "@/routes/paths";
import { Treasurers } from "@/sampleData";
import { Card, CardFooter, CardTitle } from "@workspace/ui/components/card";
import { ArrowRight, Copy, Plus, Wallet } from "lucide-react";

type TreasurerListCardProps = {
  router: any;
};

const TreasurerListCard = ({ router }: TreasurerListCardProps) => {
  return (
    // <div className="flex items-center w-full">
    <div className="grid grid-cols-4 gap-4 w-full">
      <Card
        className="w-full flex items-center justify-center text-blue-500 bg-blue-50 border-sm border-primary border-dashed cursor-pointer hover:shadow-lg hover:text-blue-400 gap-2"
        onClick={() => router.push(PATHS.TREASURY.ADD)}
      >
        <span className="text-center text-base">Add treasurer</span>
        <Plus size={24} />
      </Card>
      {Treasurers &&
        Treasurers.map((treasurer) => {
          return (
            <Card
              key={treasurer.id}
              className="cursor-pointer hover:shadow-lg p-4"
              onClick={() =>
                router.push(PATHS.TREASURY.DETAILS(treasurer.cuid))
              }
            >
              <CardTitle className="flex flex-col gap-1 w-full">
                <div className="text-base tracking-wide text-[#334155] flex">
                  {treasurer.eName}
                </div>
                <div className="flex items-center gap-2 text-sm bg-500 font-normal">
                  <Wallet size={16} strokeWidth={2.75} color="#64748B" />
                  <span className="text-[#64748B]">
                    {treasurer.walletAddress}
                  </span>
                  <Copy
                    className="text-[#94A3B8]"
                    size={16}
                    strokeWidth={2.75}
                  />
                </div>
              </CardTitle>

              <CardFooter className="flex items-center p-0 mt-8">
                <div className="flex items-center gap-2 text-blue-500 font-normal">
                  <span>View details</span>
                  <ArrowRight size={24} strokeWidth={2} />
                </div>
              </CardFooter>
            </Card>
          );
        })}
    </div>
    // </div>
  );
};

export default TreasurerListCard;
