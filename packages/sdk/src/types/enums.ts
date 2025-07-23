export type RedemptionStatus = "PENDING" | "COMPLETED";
export const RedemptionStatus = {
  PENDING: "PENDING" as RedemptionStatus,
  COMPLETED: "COMPLETED" as RedemptionStatus,
};


export type UserType = 'EMPLOYEE' | 'VOLUNTEER' | 'CONTRACTOR' | 'INTERN';
export const UserType = {
  EMPLOYEE: 'EMPLOYEE' as UserType,
  VOLUNTEER: 'VOLUNTEER' as UserType,
  CONTRACTOR: 'CONTRACTOR' as UserType,
  INTERN: 'INTERN' as UserType,
};


type GenderType = 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN';
export const Gender = {
    MALE: 'MALE' as GenderType,
    FEMALE: 'FEMALE' as GenderType,
    OTHER: 'OTHER' as GenderType,
    UNKNOWN: 'UNKNOWN' as GenderType,
};
