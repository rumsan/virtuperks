


import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { useState } from "react";

type DialogButtonProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  subTitle: string;
  buttonName: string;
  submitType?: "Apply" | "Complete" | "Disperse" | "directdisburse";
  inputLabel?: string;
  inputPlaceholder?: string;
  handleApplyTaskLogic?: (data?: {
    completionUrl?: string;
    amount?: string;
    to?: string;
    remarks?: string;
  }) => Promise<void>;
  isDisabled?: boolean;
};

export const DialogButton = ({
  isOpen,
  setIsOpen,
  title,
  subTitle,
  submitType = "Apply",
  buttonName,
  inputLabel = "Completion URL",
  inputPlaceholder = "https://example.com/completion",
  handleApplyTaskLogic,
  isDisabled,
}: DialogButtonProps) => {
  const [formData, setFormData] = useState<{
    completionUrl: string;
    amount: string;
    to: string;
    remarks: string;
  }>({
    completionUrl: "",
    amount: "",
    to: "",
    remarks: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const validateInputs = () => {
    if (submitType === "Complete" && !formData.completionUrl.trim()) {
      return "Completion URL is required";
    }
    if ((submitType === "Disperse" || submitType === "directdisburse") && !formData.amount.trim()) {
      return "Amount is required";
    }
    if (submitType === "directdisburse" && !formData.to.trim()) {
      return "Recipient address is required";
    }
    return null;
  };

  const handleSubmit = async () => {
    setError(null);
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      toast({
        title: "Invalid Input",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    try {
      let submitData: Parameters<NonNullable<typeof handleApplyTaskLogic>>[0] = {};
      if (submitType === "Complete") {
        submitData = { completionUrl: formData.completionUrl.trim() };
      } else if (submitType === "Disperse") {
        submitData = { amount: formData.amount.trim() };
      } else if (submitType === "directdisburse") {
        submitData = {
          amount: formData.amount.trim(),
          to: formData.to.trim(),
          remarks: formData.remarks.trim(),
        };
      }

      await handleApplyTaskLogic?.(submitData);
      setFormData({ completionUrl: "", amount: "", to: "", remarks: "" });
      setIsOpen(false);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        submitType === "Complete"
          ? "Failed to submit completion URL"
          : submitType === "Disperse"
          ? "Failed to disperse amount"
          : submitType === "directdisburse"
          ? "Failed to process direct disbursement"
          : "Failed to apply for task";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const renderInputFields = () => {
    if (submitType === "Complete") {
      return (
        <div className="py-4">
          <Label htmlFor="completionUrl" className="block text-sm font-medium text-gray-700">
            {inputLabel}
          </Label>
          <Input
            id="completionUrl"
            type="url"
            value={formData.completionUrl}
            onChange={handleInputChange("completionUrl")}
            placeholder={inputPlaceholder}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${
              error ? "border-red-500" : ""
            }`}
          />
        </div>
      );
    }
    if (submitType === "Disperse") {
      return (
        <div className="py-4">
          <Label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </Label>
          <Input
            id="amount"
            type="text"
            value={formData.amount}
            onChange={handleInputChange("amount")}
            placeholder="Enter amount to disperse"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-gray-900 ${
              error ? "border-red-600" : ""}`}
          />
        </div>
      );
    }
    if (submitType === "directdisburse") {
      return (
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="text"
                  value={formData.amount}
                  onChange={handleInputChange("amount")}
                  placeholder="Enter amount"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-gray-900 ${
                    error ? "border-red-600" : ""
                  }`}
                />
              </div>
              <div>
                <Label htmlFor="to" className="block text-sm font-medium text-gray-700">
                  Recipient Address
                </Label>
                <Input
                  id="to"
                  type="text"
                  value={formData.to}
                  onChange={handleInputChange("to")}
                  placeholder="Enter recipient address"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-gray-900 ${
                    error ? "border-red-600" : ""
                  }`}
                />
              </div>
              <div>
                <Label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                  Remarks
                </Label>
                <Input
                  id="remarks"
                  type="text"
                  value={formData.remarks}
                  onChange={handleInputChange("remarks")}
                  placeholder="Enter remarks (optional)"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-gray-900"
                />
              </div>
            </div>
          );
        }
    return null;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setFormData({ completionUrl: "", amount: "", to: "", remarks: "" });
          setError(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {subTitle}
          </DialogDescription>
        </DialogHeader>
        {renderInputFields()}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDisabled}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={
              isDisabled ||
              (submitType === "Complete" && !formData.completionUrl.trim()) ||
              ((submitType === "Disperse" || submitType === "directdisburse") && !formData.amount.trim()) ||
              (submitType === "directdisburse" && !formData.to.trim())
            }
            className="bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400 disabled:text-gray-200"
          >
            {isDisabled ? "Processing..." : buttonName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
