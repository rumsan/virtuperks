import { ApiProperty } from '@nestjs/swagger';
import { CreateRedemption, CreateReward, RedemptionStatus } from '@workspace/sdk/type';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRedemptionDto implements CreateRedemption {
  @ApiProperty()
  @IsString()
  userAddress: string;

  @ApiProperty()
  @IsString()
  rewardId: string;
  
  @ApiProperty()
  @IsNumber()
  tokens: number; // Note: change to string if your schema uses BigInt

  @ApiProperty()
  @IsString()
    @IsOptional()
  transactionHash?: string; // Note: change to string if your schema uses BigInt

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  status: RedemptionStatus;

  @ApiProperty()
  @IsOptional()
  @IsString()
  taskId?: string;

  
}

