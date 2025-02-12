"use client";

import TaskMain from "@/components/tasks/details/details.main";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";

function Page() {
  const id = useParams() as { id: string };
  const router = useRouter();
  return <TaskMain cuid={id} router={router} />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
