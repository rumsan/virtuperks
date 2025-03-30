import moment from "moment";

export const formatDate = (date: number) => { 
 if(!date) return "";
    
            const expiryTimeStamp = BigInt(date);
            const expiryInMs = Number(expiryTimeStamp) * 1000;
    const formattedData = moment(expiryInMs).format("Do MMMM, YYYY");
    return formattedData
  
}