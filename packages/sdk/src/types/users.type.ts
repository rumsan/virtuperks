import { VirtueperkCommonField } from './common.type';
import type { GenderType } from './enums';

export interface User {
  id?: number;
  cuid: string;
  gender?: GenderType;  
  email?: string | null;
  phone?: string | null;
  wallet?: string | null;
  notes?: string | null;
  sessionId?: string | null;
}


export type UserBasic = User & VirtueperkCommonField;
export type CreateUser = Partial<User>;
export type UpdateUser = Partial<CreateUser>;
