


import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, ArrowRight } from "lucide-react";






// Add this type for button states
type ButtonState = "APPLY" | "WAITING" | "COMPLETE" | "COMPLETED";

// Add this function after your existing handleStatus function
 export const getButtonState = (
  participantData: any, 
  acceptedData: any, 
  completedData: any,
  address: string
 ): ButtonState => {
  
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

