"use client";

import RewardDetails from "@/components/token_marketplace/details/reward.details";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";

function Page() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  return <RewardDetails rewardId={id} router={router} />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
