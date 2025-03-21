"use client";

import DepartmentEdit from "@/components/departments/form/department.edit";
import dynamic from "next/dynamic";

function Page() {
  return <DepartmentEdit />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
