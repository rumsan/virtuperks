export type RedemptionStatus = "PENDING" | "PROCESSING" | 'FAILED' | "CANCELLED"|"REJECTED" | "COMPLETED" | "SUCCESS";
export const RedemptionStatus = {
  PENDING: "PENDING" as RedemptionStatus,
  PROCESSING: "PROCESSING" as RedemptionStatus,
  FAILED: "FAILED" as RedemptionStatus,
  CANCELLED: "CANCELLED" as RedemptionStatus,
  REJECTED: "REJECTED" as RedemptionStatus,
  COMPLETED: "COMPLETED" as RedemptionStatus,
  SUCCESS: "SUCCESS" as RedemptionStatus,
};