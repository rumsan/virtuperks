import { Config, defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import {
  AppRegistryABI,
  RewardManagementABI,
  RewardManagementFactoryABI,
  RewardTokenABI,
} from "@workspace/contracts/abis";

import { Abi } from "viem";

export default defineConfig({
  out: "hooks/wagmi/contracts.ts",
  contracts: [
    {
      name: "AppRegistry",
      abi: AppRegistryABI as Abi,
    },
    {
      name: "RewardManagement",
      abi: RewardManagementABI as Abi,
    },
    {
      name: "Reward Token",
      abi: RewardTokenABI as Abi,
    },
    {
      name: "RewardManagementFactory",
      abi: RewardManagementFactoryABI as Abi,
    },
  ],
  plugins: [react()],
}) as Config;
