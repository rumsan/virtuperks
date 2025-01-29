"use client";

import DepartmentList from "@/components/departments/list";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return <DepartmentList router={router} />;
}

export default dynamic(() => Promise.resolve(Page));
