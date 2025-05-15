// providers/walletProvider.tsx
"use client";

import { PATHS } from "@/routes/paths";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAccount } from "wagmi";

interface WalletContextType {
  isConnected: boolean;
  address: string | undefined;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: undefined,
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { address, isConnected } = useAccount();

  const router = useRouter();
  const [wasConnected, setWasConnected] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    if (!initialCheckDone) {
      // if (!isConnected) {
      //   console.log('Initial load: No wallet connected, redirecting to task portal');
      //   router.push(PATHS.TASKPORTAL.HOME);
      // }
      setInitialCheckDone(true);
      setWasConnected(isConnected);
      return;
    }

    // If user was connected and now isn't, redirect to task_portal
    if (wasConnected && !isConnected) {
      router.push(PATHS.TASKPORTAL.HOME);
    }

    // Update wasConnected state when connection status changes
    setWasConnected(isConnected);
  }, [isConnected, router, address, initialCheckDone]);

  const value = {
    isConnected,
    address,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

// Custom hook to use wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
