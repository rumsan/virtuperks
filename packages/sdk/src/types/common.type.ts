export type CommonFields = {
  cuid: string;
  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  deletedAt?: Date | null;
  updatedBy?: string;
};

export type VirtueperkCommonField = {
  id: string;
  createdBy?: string;
  updatedBy?: string;
}