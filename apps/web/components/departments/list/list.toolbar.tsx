"use client";

import ListFilter from "@/components/common/list/list.filter";
import { Input } from "@workspace/ui/components/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

// interface ListToolBarProps<TData> {
//   table: Table<TData>;
// }

export default function ListToolBar() {
  const router = useRouter();
  return (
    <div className="w-full flex items-center space-x-2">
      <div className="flex w-[85%]">
        <div className="w-full h-10 flex rounded-md border border-gray-200 rounded-md items-center p-3">
          <p className="text-gray-500">
            <Search size={20} strokeWidth={2.75} />
          </p>
          <Input
            type="text"
            placeholder="Search"
            className="border-none focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2 ml-auto w-[15%] justify-end">
        <ListFilter />
        {/* <Button
          color="primary"
          className="min-w-[12rem] fw-[600] h-10 bg-primary"
          variant="default"
          type="submit"
          onClick={() => router.push(PATHS.DEPARTMENT.ADD)}
        >
          <Plus size={22} strokeWidth={2.75} />
          <span>Add Department</span>
        </Button> */}
      </div>
    </div>
  );
}
