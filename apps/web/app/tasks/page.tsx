"use client";

import Task from "@/components/tasks/main";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return <Task router={router} />;
}

export default dynamic(() => Promise.resolve(Page));
