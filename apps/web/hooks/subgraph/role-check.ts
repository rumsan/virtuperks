import { useAccount } from "wagmi";
import { useReadAppRegistryHasRole } from "../wagmi/contracts";



export const useRoleCheck = ( role: `0x${string}` | undefined) => {

    const { address } = useAccount();
    const { data, isError, isLoading } = useReadAppRegistryHasRole({
    address: process.env.NEXT_PUBLIC_APPREGISTRY as `0x${string}`,
    args: [process.env.NEXT_PUBLIC_APP_ID as `0x${string}`, role??'0x0', address??'0x0'],
  

})

  return {
    roleStatus:data,
    isError,
    statusLoading: isLoading,
  };
};
