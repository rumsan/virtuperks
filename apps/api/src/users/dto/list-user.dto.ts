import { UserType } from '@workspace/sdk/type';
import { UserDetail } from '@workspace/sdk/types/userDetails.type';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UserFilterDto implements UserDetail {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  level?: string[];

  @IsOptional()
  @IsString()
  managerId?: string;

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @IsOptional()
  @IsBoolean()
  isEmployee?: boolean;

  @IsOptional()
  @IsObject()
  extras?: Record<string, any>;

    @IsOptional()
    @IsNumber()
    id?: number;


    @IsOptional()
    @IsString()
    cuid: string;


    @IsOptional()
    deletedAt?: Date | undefined;
    
    @IsOptional()
    updatedAt: Date;

    @IsOptional()
    createdAt: Date;

    @IsOptional()
    createdBy: string;

    @IsOptional()
    updatedBy: string;
    
    
}
