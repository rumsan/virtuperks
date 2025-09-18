import { AppRegistryABI } from "@workspace/contracts/abis";
import { useAccount, useReadContract } from "wagmi";

interface HasRoleProps {
  role: string;
}

export default function hasRole({ role }: HasRoleProps) {
  const { address } = useAccount();
  console.log(AppRegistryABI, "AppRegistryABI");
  console.log("address", address);
  console.log(role, "role");
  console.log(process.env.NEXT_PUBLIC_APPREGISTRY, "appregistry");
  console.log(process.env.NEXT_PUBLIC_APP_ID, "app id");

  const { data } = useReadContract({
    address: process.env.NEXT_PUBLIC_APPREGISTRY as "0x",
    abi: AppRegistryABI,
    functionName: "hasRole",
    args: [process.env.NEXT_PUBLIC_APP_ID, role, address],
  });
  console.log("data", data);

  return data;
}
