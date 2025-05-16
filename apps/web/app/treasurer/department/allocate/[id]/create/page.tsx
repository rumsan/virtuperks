"use client";

import TokenCreateMain from "@/components/treasurer/department/details/token.main";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const id = useParams() as { id: string };
  return <TokenCreateMain router={router} id={id} />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
