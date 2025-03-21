import { CustomAlertDialog } from "@/components/common/ui/alert.dialog";
import { DialogButton } from "@/components/common/ui/dialog";


import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, ArrowRight } from "lucide-react";





import { useState, useEffect } from "react";

// Add this type for button states
type ButtonState = "APPLY" | "WAITING" | "COMPLETE" | "COMPLETED";

// Add this function after your existing handleStatus function
 export const getButtonState = (
  participantData: any, 
  acceptedData: any, 
  completedData: any,
  address: string
 ): ButtonState => {
    console.log(participantData,'form the button')
  if (completedData?.some((data: any) => 
    data?.participant?.toLowerCase() === address?.toLowerCase()
  )) {
    return "COMPLETED";
  }
  
  if (acceptedData?.some((data: any) =>
    data?.participant?.toLowerCase() === address?.toLowerCase()
  )) {
    return "COMPLETE";
  }
  
  if (participantData?.some((data: any) =>
    data?.participant?.toLowerCase() === address?.toLowerCase()
  )) {
    return "WAITING";
  }
  
  return "APPLY";
};

// Replace your existing button rendering with this
const ButtonContent = ({ 
  state, 
  onApply, 
  onComplete 
}: { 
  state: ButtonState; 
  onApply: () => void; 
  onComplete: () => void;
}) => {
  switch (state) {
    case "COMPLETED":
      return (
        <Button className="bg-[#03AB65]" disabled>
          <span className="text-[#F8FAFC]">Task Completed</span>
        </Button>
      );
    case "COMPLETE":
      return (
        <Button className="bg-[#297AD6]" onClick={onComplete}>
          <span className="text-[#F8FAFC]">Mark as completed</span>
          <ArrowRight color="#F8FAFC" strokeWidth={2.5} size={20} />
        </Button>
      );
    case "WAITING":
      return (
        <Button className="bg-[#F59E0B]" disabled>
          <span className="text-[#F8FAFC]">Waiting for Approval</span>
        </Button>
      );
    default:
      return (
        <Button className="bg-[#297AD6]" onClick={onApply}>
          <span className="text-[#F8FAFC]">Apply for task</span>
          <ArrowRight color="#F8FAFC" strokeWidth={2.5} size={20} />
        </Button>
      );
  }
};

export default ButtonContent;
