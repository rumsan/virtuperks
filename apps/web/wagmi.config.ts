import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import {
  AccessManagerABI,
  EntityTaskManagementABI,
  RewardTokenABI,
} from "@workspace/contracts/abis";
import { Abi } from "viem";

export default defineConfig({
  out: "hooks/wagmi/contracts.ts",
  contracts: [
    {
      name: "Access Manager",
      abi: AccessManagerABI as Abi,
    },
    {
      name: "EntityTaskManager",
      abi: EntityTaskManagementABI as Abi,
    },
    {
      name: "Reward Token",
      abi: RewardTokenABI as Abi,
    },
  ],
  plugins: [react()],
});
