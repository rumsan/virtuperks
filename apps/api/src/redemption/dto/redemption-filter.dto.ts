import { IsOptional, IsString } from 'class-validator';

export class RedemptionFilterDto {
  @IsOptional()
  @IsString()
  rewardId?: string;


  @IsOptional()
  @IsString()
  walletAddress?: string;


  
}