"use client";

import Participant from "@/components/participants/main";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return <Participant router={router} />;
}

export default dynamic(() => Promise.resolve(Page));
