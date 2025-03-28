"use client";

import { CustomAlertDialog } from "@/components/common/ui/alert.dialog";
import { PATHS } from "@/routes/paths";
import { AccessManagerABI } from "@workspace/contracts/abis";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

interface ValidationProps {
  children: ReactNode;
  role: string;
}

const Validation = ({ children, role }: ValidationProps) => {
  const [alertDialog, setAlertDialog] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const router = useRouter();
  const { address } = useAccount();

  const { data, isLoading } = useReadContract({
    address: (process.env.NEXT_PUBLIC_ACCESSMANAGER?.startsWith("0x") ? process.env.NEXT_PUBLIC_ACCESSMANAGER : "") as `0x${string}`,
    abi: AccessManagerABI,
    functionName: "hasRole",
    args: [process.env.NEXT_PUBLIC_APP_ID, role, address],
  });

  useEffect(() => {
    
    if (!isLoading) {
      setIsValidating(false);
      if (data === false) { // Only show dialog if we explicitly get false
        setAlertDialog(true);
      }
    }
  }, [data, isLoading]);

  const handleDialogClose = (shouldClose: boolean) => {
    setAlertDialog(false);
    if (shouldClose) {
      router.push(`${PATHS.DASHBOARD}`);
    }
  };

  if (isValidating || isLoading) {
    return null; // Show nothing while validating
  }

  return (
    <div>
      {data ? children : (
        alertDialog && (
          <CustomAlertDialog
            alertDialog={alertDialog}
            setAlertDialog={setAlertDialog}
            textData="Access Denied"
            buttonName="Ok"
            onClose={handleDialogClose}
          />
        )
      )}
    </div>
  );
};

export default Validation;
