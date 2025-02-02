import { PATHS } from "@/routes/paths";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowRight, Copy, Plus, Wallet } from "lucide-react";

export const Treasurers = [
  {
    id: 1,
    cuid: "c2ue79csndkcdnk3cd",
    eName: "Nishu Bade Shrestha",
    walletAddress: "0xhf094bfnj38ddbj484n48",
    amount: 23000,
  },
  {
    id: 2,
    cuid: "c2ue79csndkcdnk3cd",
    eName: "Nishu Bade Shrestha",
    walletAddress: "0xhf094bfnj38ddbj484n48",
    amount: 23000,
  },
  {
    id: 3,
    cuid: "c2ue79csndkcdnk3cd",
    eName: "Nishu Bade Shrestha",
    walletAddress: "0xhf094bfnj38ddbj484n48",
    amount: 23000,
  },
];

type TreasurerListCardProps = {
  router: any;
};

const TreasurerListCard = ({ router }: TreasurerListCardProps) => {
  return (
    <div className="flex items-center w-full">
      <div className="grid grid-cols-4 gap-4 w-full">
        <Card
          className="w-full flex items-center justify-center text-blue-500 bg-blue-50 border-sm border-primary border-dashed cursor-pointer hover:shadow-lg hover:text-blue-400 gap-2"
          onClick={() => router.push(PATHS.TREASURER.ADD)}
        >
          <span className="text-center text-base">Add treasurer</span>
          <Plus size={24} />
        </Card>
        {Treasurers &&
          Treasurers.map((treasurer) => {
            return (
              <Card
                key={treasurer.id}
                className="cursor-pointer hover:shadow-lg"
                onClick={() =>
                  router.push(PATHS.TREASURER.DETAILS(treasurer.cuid))
                }
              >
                <CardHeader>
                  <CardTitle className="text-base flex ">
                    {treasurer.eName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-sm bg-500">
                    <Wallet size={16} strokeWidth={2.75} />
                    <span>{treasurer.walletAddress}</span>
                    <Copy
                      className="text-gray-400"
                      size={16}
                      strokeWidth={2.75}
                    />
                  </CardDescription>
                </CardHeader>

                <CardFooter className="flex items-center justify-center gap-2 text-blue-500 font-normal">
                  <div className="text-2xl font-bold">{treasurer.amount}</div>
                  <div className="flex items-center ml-auto gap-2">
                    <span>View details</span>
                    <ArrowRight size={24} strokeWidth={2} />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default TreasurerListCard;
