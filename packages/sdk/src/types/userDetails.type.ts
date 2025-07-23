import { VirtueperkCommonField } from './common.type';
import { UserType } from './enums';

export interface UserDetails {
 
  name?: string;
  departmentId?: string | null;
userType?: UserType;
managerId?: string | null;
    isApproved?: boolean;
  isEmployee?: boolean;
  extras?: Record<string, any>;
}

export type UserDetail = UserDetails & VirtueperkCommonField & { cuid: string };

export type CreateUserDetails = UserDetails;
export type EditUserDetails = Partial<CreateUserDetails>;