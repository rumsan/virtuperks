import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowRight, Copy, Plus, User, Wallet } from "lucide-react";
import React from "react";

const Treasurers = [
  {
    id: 1,
    eName: "Nishu Bade Shrestha",
    walletAddress: "0xhf094bfnj38ddbj484n48",
    amount: 23000,
  },
  {
    id: 2,
    eName: "Nishu Bade Shrestha",
    walletAddress: "0xhf094bfnj38ddbj484n48",
    amount: 23000,
  },
  {
    id: 3,
    eName: "Nishu Bade Shrestha",
    walletAddress: "0xhf094bfnj38ddbj484n48",
    amount: 23000,
  },
];

const TreasurerListCard = () => {
  return (
    <div className="flex items-center w-full">
      <div className="grid grid-cols-4 gap-4 w-full">
        <Card className="w-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Plus className="text-primary" size={48} />
            <p className="text-center text-base text-primary text-muted-foreground">
              Add treasurer
            </p>
          </div>
        </Card>
        {Treasurers &&
          Treasurers.map((treasurer) => {
            return (
              <Card key={treasurer.id} className="">
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
