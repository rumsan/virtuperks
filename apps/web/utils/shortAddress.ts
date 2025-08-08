export const shortAddress = (address: string): string => {
  console.log("shortAddress", address);
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
