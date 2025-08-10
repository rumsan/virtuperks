export type ParticipantLookupData = {
  users: {
    name: string;
    wallet: string;
  }[];
};
export interface UserDetailsLookup {
  name?: string;
  [key: string]: any;
}
export interface UserLookup {
  cuid: string;
  wallet: string | null;
  details: UserDetailsLookup;
}

