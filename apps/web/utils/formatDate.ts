import { PhoneNumberUtil } from "google-libphonenumber";
import moment from "moment";

export const formatDate = (date: number) => {
  if (!date) return "";

  const expiryTimeStamp = BigInt(date);
  const expiryInMs = Number(expiryTimeStamp) * 1000;
  const formattedData = moment(expiryInMs).format("Do MMMM, YYYY");
  return formattedData;
};

export const formatTokenAmount = (
  amount: string | number | undefined | null,
): string => {
  if (!amount) return "0";

  try {
    const numericAmount =
      typeof amount === "string" ? parseInt(amount, 10) : amount;
    return isNaN(numericAmount) ? "0" : numericAmount.toLocaleString();
  } catch (error) {
    console.error("Error formatting token amount:", error);
    return "0";
  }
};

export const validatePhoneNumber = (phone: string, region = "NP"): boolean => {
  const phoneUtil = PhoneNumberUtil.getInstance();
  try {
    const number = phoneUtil.parse(phone, region);
    return phoneUtil.isValidNumber(number);
  } catch (error) {
    console.error("Error validating phone number:", error);
    return false;
  }
};
