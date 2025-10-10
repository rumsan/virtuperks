import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRedemption, RedemptionStatus } from '@workspace/sdk/type';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRedemptionDto implements CreateRedemption {


  @ApiProperty({ description: 'CUID of the reward being redeemed' })
  @IsString()
  @IsNotEmpty()
  rewardId: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
   status?: RedemptionStatus


  @ApiProperty({ description: 'Transaction hash from blockchain', required: false })
  @IsString()
  @IsOptional()
  transactionHash: string;
}

export class UpdateRedemptionDto  extends PartialType(CreateRedemptionDto) {}

