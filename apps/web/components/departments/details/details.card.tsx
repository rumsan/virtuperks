import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Coins, Copy, User, Wallet } from "lucide-react";
import { Departments } from "../list/list.card";
import { Cuid } from "./details.main";

type DepartmentDetailsCardProps = {
  cuid: Cuid;
};

export default function DepartmentDetailsCard({
  cuid,
}: DepartmentDetailsCardProps) {
  const data = Departments.find((department) => department.cuid === cuid.id);
  return (
    <div className="grid grid-cols-3 mt-4 gap-4">
      <Card className="font-normal text-base h-40 flex flex-col">
        <CardHeader className="flex-grow">
          <CardTitle className="flex p-0 mb-4">
            <span>{data?.dName}</span>
            <User size={24} strokeWidth={2} className="ml-auto" />
          </CardTitle>
          <CardDescription className="flex items-center text-sm h-4">
            <p className="text-2xl font-bold text-blue-500 mr-5">
              {data?.eName}
            </p>
            <span className="w-[90px] h-6 flex items-center justify-center bg-gray-100 rounded-xl text-sm">
              Rumsan
            </span>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center text-gray-400">
          <div className="flex items-center justify-center gap-1">
            <Wallet size={16} strokeWidth={2.75} color="#4f4f4f" />
            <span className="font-normal text-sm text-gray-500">
              0x01anb9393bc9j39i38d
            </span>
            <Copy size={16} strokeWidth={3} color="#868888" />
          </div>
        </CardFooter>
      </Card>

      <Card className="font-normal text-base h-40 flex flex-col">
        <CardHeader className="flex-grow">
          <CardTitle className="flex p-0 mb-4">
            <span>Overall tokens associated</span>
            <Coins size={24} strokeWidth={2} className="ml-auto" />
          </CardTitle>
          <CardDescription className="flex items-center text-sm">
            <div className="h-4"></div>
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
          23,000
        </CardFooter>
      </Card>

      <Card className="font-normal text-base h-40 flex flex-col">
        <CardHeader className="flex-grow">
          <CardTitle className="flex p-0 mb-4">
            <span>Current tokens</span>
            <Coins size={24} strokeWidth={2} className="ml-auto" />
          </CardTitle>
          <CardDescription className="flex items-center text-sm">
            <div className="h-4"></div>
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex items-center text-blue-500 text-2xl font-bold">
          5,000
        </CardFooter>
      </Card>
    </div>
  );
}
