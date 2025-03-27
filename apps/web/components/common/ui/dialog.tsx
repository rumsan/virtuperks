import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@workspace/ui/components/dialog";

type DialogButtonProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  subTitle: string;
  buttonName: string;
  handleApplyTaskLogic?: () => Promise<void>;
  isDisabled?: boolean;
};

export const DialogButton = ({
  isOpen,
  setIsOpen,
  title,
  subTitle,
  buttonName,
  handleApplyTaskLogic,
  isDisabled
}: DialogButtonProps) => {
  const handleSubmit = async () => {
    if (handleApplyTaskLogic) {
      try {
        await handleApplyTaskLogic(); // Execute the async function
        setIsOpen(false); // Close the dialog on success
      } catch (error) {
        console.error("Error in dialog submit:", error);
        // Optionally keep dialog open on error, or close it anyway
      }
    }
  

  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-gray-500">{subTitle}</p>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDisabled}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isDisabled}
          >
            {buttonName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
