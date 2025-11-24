import { AppRegistryABI } from "@workspace/contracts/abis";
import { useReadContract } from "wagmi";

interface HasRoleProps {
  role: string;
  address?: `0x${string}`;
}

export default function hasRole({ role, address }: HasRoleProps): boolean {
  const { data } = useReadContract({
    address: process.env.NEXT_PUBLIC_APPREGISTRY as `0x${string}`,
    abi: AppRegistryABI,
    functionName: "hasRole",
    args: [process.env.NEXT_PUBLIC_APP_ID, role, address],
  });

  return Boolean(data); 
}
