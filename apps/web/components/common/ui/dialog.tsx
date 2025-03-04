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
  setIsOpen: any;
}

export function DialogButton({ isOpen, setIsOpen }: DialogButtonProps) {
  console.log(isOpen, "isOpen");
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Open Dialog</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center justify-center">
          <DialogTitle className="font-bold text-xl">
            Allocate Token
          </DialogTitle>
          <DialogDescription className="text-[#64748B]">
            Are you sure you want to confirm this token allocation?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="w-[170px] flex justify-center items-center gap-2"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-[170px] flex justify-center items-center gap-2"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
