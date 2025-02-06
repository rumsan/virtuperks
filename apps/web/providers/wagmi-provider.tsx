'use client';

import { config } from '@/wagmi.config';
import { WagmiProvider } from 'wagmi';

export const Wagmi = ({ children }: { children: React.ReactNode }) => {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
};