import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { ConnectKitButton } from "connectkit";
import { Wallet } from "lucide-react";

interface CustomAlertDialogProps {
  alertDialog: boolean;
  setAlertDialog: (value: boolean) => void;
  textData?: string;
  buttonName?: string;
  onClose?: (shouldClose: boolean) => void;
}

export function CustomAlertDialog({
  alertDialog,
  setAlertDialog,
  textData = "Access Denied",
  buttonName = "Ok",
  onClose,
}: CustomAlertDialogProps) {
  const handleClose = () => {
    setAlertDialog(false);
    onClose?.(true);
  };

  return (
    <AlertDialog open={alertDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Alert</AlertDialogTitle>
          <AlertDialogDescription>
            {textData}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose}>
            {buttonName}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
