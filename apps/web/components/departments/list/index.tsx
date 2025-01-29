"use client";

import DepartmentListCard from "./list.card";
import ListToolBar from "./list.toolbar";

interface DepartmentListProps {
  router: any;
}

export default function DepartmentList({ router }: DepartmentListProps) {
  return (
    <main className="gap-2 p-4 sm:px-8 sm:py-10 md:gap-8 w-full">
      <div className="space-y-4">
        <div className="flex flex-col gap-1 my-3">
          <h1 className="font-bold text-4xl">Department</h1>
          <h3 className="text-gray-500 font-normal text-sm">
            Overview of all the departments
          </h3>
        </div>
        <ListToolBar />
        <DepartmentListCard router={router} />
      </div>
    </main>
  );
}
