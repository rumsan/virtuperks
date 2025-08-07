import { AppRegistryABI, RewardManagementABI } from "@workspace/contracts/abis";
import { useAccount, useReadContract } from "wagmi";

interface HasRoleProps {
  role: `0x${string}`
}

export default function hasRole({ role }: HasRoleProps) {
  const { address } = useAccount();

  const { data } = useReadContract({
    address: process.env.NEXT_PUBLIC_APPREGISTRY as "0x",
    abi: AppRegistryABI,
    functionName: "hasRole",
    args: [process.env.NEXT_PUBLIC_APP_ID, role, address],
  });

  return data 
}


