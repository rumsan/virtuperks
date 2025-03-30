import { AccessManagerABI } from "@workspace/contracts/abis";
import { useAccount, useReadContract } from "wagmi";

interface HasRoleProps {
  role: string;
}

export default function hasRole({ role }: HasRoleProps) {
  const { address } = useAccount();
  console.log(role,'role')

  const { data } = useReadContract({
    address: (process.env.NEXT_PUBLIC_ACCESSMANAGER?.startsWith("0x") ? process.env.NEXT_PUBLIC_ACCESSMANAGER : "") as `0x${string}`,
    abi: AccessManagerABI,
    functionName: "hasRole",
    args: [process.env.NEXT_PUBLIC_APP_ID, role, address],
  });

  return data;
}
