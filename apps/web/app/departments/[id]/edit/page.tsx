"use client";

import DepartmentEdit from "@/components/departments/form/department.edit";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return <DepartmentEdit router={router} />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
