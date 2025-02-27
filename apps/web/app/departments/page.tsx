"use client";

import Department from "@/components/departments/main";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return <Department router={router} />;
}

export default dynamic(() => Promise.resolve(Page));
