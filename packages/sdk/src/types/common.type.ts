export type CommonFields = {
  id: string;
  internal_id?: string;
  createdBy?: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  __typename: string;
};

export type VirtueperkCommonField = {
  cuid: string;
  createdBy?: string;
  updatedBy?: string;
}