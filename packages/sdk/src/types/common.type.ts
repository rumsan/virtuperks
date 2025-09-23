export type CommonFields = {
  cuid: string;
  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  deletedAt?: Date | null;
  updatedBy?: string;
};

export type VirtueperkCommonField = {
  cuid: string;
  createdBy?: string;
  updatedBy?: string;
}