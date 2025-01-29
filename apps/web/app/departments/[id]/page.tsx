"use client";

import DepartmentDetails from "@/components/departments/details/details.main";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";

function Page() {
  const id = useParams() as { id: string };
  const router = useRouter();
  return <DepartmentDetails cuid={id} router={router} />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
