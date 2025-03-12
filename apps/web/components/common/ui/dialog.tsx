import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

interface DialogButtonProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  subTitle: string;
  buttonName: string;
  handleApplyTaskLogic?: () => void;
}

export function DialogButton({
  isOpen,
  setIsOpen,
  title,
  subTitle,
  buttonName,
  handleApplyTaskLogic,
}: DialogButtonProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Open Dialog</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center justify-center">
          <DialogTitle className="flex items-center text-center font-bold text-lg text-[#0F172A]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-[#64748B] text-sm">
            {subTitle}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center mt-2">
          <DialogClose asChild>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="w-[170px] flex justify-center items-center gap-2 "
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-[170px] flex justify-center items-center gap-2 bg-[#297AD6]"
            onClick={() => {
              setIsOpen(false);
              handleApplyTaskLogic();
            }}
          >
            {buttonName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
