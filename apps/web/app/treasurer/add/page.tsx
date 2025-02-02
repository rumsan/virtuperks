"use client";

import TreasurerAdd from "@/components/treasurers/form/treasurer.add";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return <TreasurerAdd router={router} />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
