"use client";

import { TreasurerList } from "@/components/treasurers/list";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return <TreasurerList router={router} />;
}

export default dynamic(() => Promise.resolve(Page));
