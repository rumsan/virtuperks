import { useWriteEntityTaskManagerParticipate } from "@/hooks/wagmi/contracts";
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
  title: string;
  subTitle: string;
  buttonName: string;
  taskData: any;
}

export function DialogButton({
  isOpen,
  setIsOpen,
  title,
  subTitle,
  buttonName,
  taskData,
}: DialogButtonProps) {
  const { writeContractAsync } = useWriteEntityTaskManagerParticipate();

  const handleApplyTask = async () => {
    const result = await writeContractAsync({
      address: (taskData?.entityTaskManager?.id as `0x${string}`) || "0x",
      args: [taskData?.id],
    });
  };

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
              handleApplyTask();
            }}
          >
            {buttonName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
