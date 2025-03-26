'use client'

import { PATHS } from "@/routes/paths";
import { Button } from "@workspace/ui/components/button";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function Page() {
  const router = useRouter();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      router.push(PATHS.TASKPORTAL.HOME);
    }
  }, [isConnected, router]);

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
        <ConnectKitButton />
      </div>
    </div>
  );
}
