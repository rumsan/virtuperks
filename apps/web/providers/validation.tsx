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
  const router = useRouter();
  const { address } = useAccount();

  const { data } = useReadContract({
    address: process.env.NEXT_PUBLIC_ACCESSMANAGER || "",
    abi: AccessManagerABI,
    functionName: "hasRole",
    args: [process.env.NEXT_PUBLIC_APPID, role, address],
  });

  useEffect(() => {
    if (!data) {
      setAlertDialog(true);
    }
  }, [data]);

  const handleDialogClose = (shouldClose: boolean) => {
    setAlertDialog(false);
    if (shouldClose) {
      router.push(`${PATHS.DASHBOARD}`);
    }
  };
  return (
    <div>
      {data
        ? children
        : alertDialog && (
            <CustomAlertDialog
              alertDialog={alertDialog}
              setAlertDialog={setAlertDialog}
              textData="Access Denied"
              buttonName="Ok"
              onClose={handleDialogClose}
            />
          )}
    </div>
  );
};

export default Validation;
