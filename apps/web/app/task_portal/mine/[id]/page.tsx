"use client";

import TaskPortalMain from "@/components/taskPortal/details";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";

function Page() {
  const id = useParams() as { id: string };
  const router = useRouter();

  return <TaskPortalMain cuid={id} router={router} />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
