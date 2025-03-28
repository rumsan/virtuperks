import { AccessManagerABI } from "@workspace/contracts/abis";
import { useAccount, useReadContract } from "wagmi";

// interface HasRoleProps {
//   role: string;
// }

export default function hasRole({ role }: HasRoleProps) {
  const { address } = useAccount();

  const { data } = useReadContract({
    address: process.env.NEXT_PUBLIC_ACCESSMANAGER || "",
    abi: AccessManagerABI,
    functionName: "hasRole",
    args: [process.env.NEXT_PUBLIC_APPID, role, address],
  });

  return data;
}
