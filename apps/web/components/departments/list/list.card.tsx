import { PATHS } from "@/routes/paths";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowRight, Plus, User } from "lucide-react";

export const Departments = [
  {
    id: 1,
    cuid: "c29ufh4849ccvmfk",
    name: "Rumsan Consulting",
    dName: "Rumsan",
    eName: "Nishu Bade Shrestha",
  },
  {
    id: 2,
    cuid: "c29ufh4849ccvmfk",
    name: "Rumsan Consulting",
    dName: "Rumsan",
    eName: "Nishu Bade Shrestha",
  },
  {
    id: 3,
    cuid: "c29ufh4849ccvmfk",
    name: "Rumsan Consulting",
    dName: "Rumsan",
    eName: "Nishu Bade Shrestha",
  },
  {
    id: 4,
    cuid: "c29ufh4849ccvmfk",
    name: "Rumsan Consulting",
    dName: "Rumsan",
    eName: "Nishu Bade Shrestha",
  },
  {
    id: 5,
    cuid: "c29ufh4849ccvmfk",
    name: "Rumsan Consulting",
    dName: "Rumsan",
    eName: "Nishu Bade Shrestha",
  },
  {
    id: 6,
    cuid: "c29ufh4849ccvmfk",
    name: "Rumsan Consulting",
    dName: "Rumsan",
    eName: "Nishu Bade Shrestha",
  },
  {
    id: 7,
    cuid: "c29ufh4849ccvmfk",
    name: "Rumsan Consulting",
    dName: "Rumsan",
    eName: "Nishu Bade Shrestha",
  },
  {
    id: 8,
    cuid: "c29ufh4849ccvmfk",
    name: "Rumsan Consulting",
    dName: "Rumsan",
    eName: "Nishu Bade Shrestha",
  },
  {
    id: 9,
    cuid: "c29ufh4849ccvmfk",
    name: "Rumsan Consulting",
    dName: "Rumsan",
    eName: "Nishu Bade Shrestha",
  },
  {
    id: 10,
    cuid: "c29ufh4849ccvmfk",
    name: "Rumsan Consulting",
    dName: "Rumsan",
    eName: "Nishu Bade Shrestha",
  },
];

const DepartmentListCard = ({ router }: any) => {
  return (
    <div className="flex items-center w-full">
      <div className="grid grid-cols-4 gap-4 w-full">
        <Card
          style={{
            border: "1px dashed #3B82F6",
            outline: "none",
          }}
          className="w-full flex items-center justify-center text-blue-500 bg-blue-50 cursor-pointer hover:shadow-lg hover:text-blue-400"
          onClick={() => router.push(PATHS.DEPARTMENT.ADD)}
        >
          {/* <div className="flex items-center text-blue-500 gap-2"> */}
          <span className="text-center text-base">Add Department</span>
          <Plus size={24} />
          {/* </div> */}
        </Card>
        {Departments &&
          Departments.map((department) => {
            return (
              <Card
                key={department.id}
                className="cursor-pointer hover:shadow-lg"
                onClick={() =>
                  router.push(PATHS.DEPARTMENT.DETAILS(department.cuid))
                }
              >
                <CardHeader>
                  <CardTitle className="text-base flex ">
                    {department.name}
                    <span className="ml-auto w-[90px] flex items-center justify-center bg-gray-100 rounded-xl font-normal text-sm">
                      {department.dName}
                    </span>
                  </CardTitle>
                  <CardDescription className="flex gap-2 text-sm">
                    <User size={20} strokeWidth={2.75} />
                    <span>{department.eName}</span>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-end gap-2 text-blue-500 font-normal">
                  <div className="flex items-center justify-center">
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

export default DepartmentListCard;
