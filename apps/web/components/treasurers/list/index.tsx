"use client";

import TreasurerListCard from "./list.card";
import ListToolBar from "./list.toolbar";

type TreasurerListProps = {
  router: any;
};

export function TreasurerList({ router }: TreasurerListProps) {
  return (
    <main className="gap-2 p-4 sm:px-8 sm:py-10 md:gap-8 w-full">
      <div className="flex items-center space-y-4">
        <div className="flex flex-col gap-1 my-3">
          <h1 className="font-bold text-4xl">Treasurers</h1>
          <h3 className="text-gray-500 font-normal text-sm">
            List of all the treasurers
          </h3>
        </div>
        <ListToolBar />
      </div>
      <TreasurerListCard />
    </main>
  );
}
