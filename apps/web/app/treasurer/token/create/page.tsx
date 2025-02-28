"use client";

import TokenCreateMain from "@/components/treasurer/token/form/token.main";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return <TokenCreateMain router={router} />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
