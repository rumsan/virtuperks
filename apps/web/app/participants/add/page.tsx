"use client";

import ParticipantAdd from "@/components/participants/form/participant.add";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return <ParticipantAdd router={router} />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
