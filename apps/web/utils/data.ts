type Token = {
  name: string;
  address: string;
};

type participant = {
  name: string;
  wallet: string;
}


export const tokenList: Token[] = [
  { name: "rumsan", address: "0x1234567890abcdef" },
  { name: "Rahat", address: "0x6320ca8209d9a1F127D740ce01A5b728384255f8" },

];


export const ParticipantList: participant[] = [
  { name: "account-1", wallet: "0x1234567890abcdef" },
  { name: "account-2", wallet: "0x6320ca8209d9a1F127D740ce01A5b728384255f8" },

];