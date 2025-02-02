"use client";

import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";

// interface ListToolBarProps<TData> {
//   table: Table<TData>;
// }

export default function ListToolBar() {
  return (
    <div className="w-full flex justify-end items-center space-x-2">
      <Button
        className="min-w-[12rem] fw-[600] h-10"
        variant="default"
        type="submit"
      >
        <Plus size={22} strokeWidth={2.75} />
        <span>Add Treasurer</span>
      </Button>
    </div>
  );
}
