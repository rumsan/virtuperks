"use client";

import TaskAdd from "@/components/departments/task_form/task.add";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return <TaskAdd router={router} />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
