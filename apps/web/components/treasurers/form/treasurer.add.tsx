"use client";

import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";

export default function TreasurerAdd() {
  return (
    <Button
      className="min-w-[12rem] fw-[600] h-10"
      variant="default"
      type="submit"
    >
      <Plus size={22} strokeWidth={2.75} />
      <span>Add Treasurer</span>
    </Button>
  );
}
