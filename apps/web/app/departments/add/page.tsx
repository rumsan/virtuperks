"use client";

import DepartmentAdd from "@/components/departments/form/department.add";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return <DepartmentAdd router={router} />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
