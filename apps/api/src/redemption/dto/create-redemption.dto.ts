import { ApiProperty } from '@nestjs/swagger';
import { CreateRedemption, RedemptionStatus } from '@workspace/sdk/type';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRedemptionDto implements CreateRedemption {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rewardId: string;

  @ApiProperty()
  @IsString()
    @IsOptional()
  transactionHash?: string;

  @ApiProperty({ required: false })
  @IsString()
   status: RedemptionStatus;


  @ApiProperty({ required: false })
@IsNotEmpty()
  @IsString()
  userPhoneNumber: string;

  
}

