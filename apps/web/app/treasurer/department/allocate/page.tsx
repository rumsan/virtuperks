"use client";

import TokenAllocateMain from "@/components/treasurer/department/form/token.main";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return <TokenAllocateMain router={router} />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
