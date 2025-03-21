import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { ConnectKitButton } from "connectkit";
import { Wallet } from "lucide-react";

interface CustomAlertDialogProps {
  alertDialog: boolean;
  setAlertDialog: (alertDialog: boolean) => void;
}

export function CustomAlertDialog({
  alertDialog,
  setAlertDialog,
}: CustomAlertDialogProps) {
  return (
    <AlertDialog open={alertDialog} onOpenChange={setAlertDialog}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent className="w-[32%] p-5">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-center text-[#0F172A] text-base font-normal gap-2">
            <Wallet size={20} strokeWidth={2.5} />
            <span>Connect your wallet address first!</span>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setAlertDialog(false);
            }}
          >
            Cancel
          </AlertDialogCancel>

          <ConnectKitButton
            customTheme={{
              "--ck-accent-color": "#00D54B",
              "--ck-accent-text-color": "#ffffff",
              "--ck-overlay-background": "rgba(255, 0, 0, 0.5)",
            }}
            showAvatar={false}
            theme="auto"
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
