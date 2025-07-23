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
  id?: number
  cuid: string;
  deletedAt?: Date;
  updatedAt: Date;
  createdAt: Date;
  createdBy: string;
  updatedBy: string;
}