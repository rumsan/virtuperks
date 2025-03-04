"use client";

import { PATHS } from "@/routes/paths";
import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";

interface ListToolBar {
  router: any;
}

export default function ListToolBar({ router }: ListToolBar) {
  return (
    <div className="w-full flex justify-end items-center space-x-2">
      <Button
        className="min-w-[12rem] fw-[600] h-10"
        variant="default"
        type="submit"
        onClick={() => router.push(PATHS.TREASURER.TOKEN.CREATE)}
      >
        <Plus size={22} strokeWidth={2.75} />
        <span>Create Token</span>
      </Button>
    </div>
  );
}
