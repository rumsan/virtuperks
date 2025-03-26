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
            onClick={handleApplyTaskLogic}
            disabled={isDisabled}
          >
            {buttonName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
