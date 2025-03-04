"use client";

import TokenMain from "@/components/treasurer/token/list";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return <TokenMain router={router} />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
