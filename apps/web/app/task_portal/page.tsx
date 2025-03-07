"use client";

import TaskPortal from "@/components/taskPortal/main";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return <TaskPortal router={router} />;
}

export default dynamic(() => Promise.resolve(Page));
