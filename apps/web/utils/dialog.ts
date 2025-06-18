export const getDialogContent = (status: string) => {
  
 
    return {
      title: status === "PENDING" 
        ? "Are you sure you want to accept this participant?" 
        : "Are you sure you want to  verify participant's tas request?",
      subTitle: status === "COMPLETED"
        ? "Are you sure you want to  verify this participant?"
        : "This action cannot be undone",
      buttonName: status === "PENDING" ? "Accept" : "Verify",
    };
};
  


  export const getDialogContents = (buttonState:string) => {
    if (buttonState === "COMPLETEd") {
      return {
        title: "Are you sure you want to mark this task as completed?",
        subTitle: "This action cannot be undone",
        buttonName: "Complete"
      };
    } else if (buttonState === "WAITING" || buttonState === "COMPLETED") {
      return null;
    } else {
      return {
        title: "Are you sure you want to apply for this task?",
        subTitle: `This task has ${1} slots available`,
        buttonName: "Apply"
      };
    }
  };