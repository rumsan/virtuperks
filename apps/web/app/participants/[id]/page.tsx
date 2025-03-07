"use client";

import ParticipantDetails from "@/components/participants/details/details.main";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";

function Page() {
  const id = useParams() as { id: string };
  const router = useRouter();
  return <ParticipantDetails cuid={id} router={router} />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
