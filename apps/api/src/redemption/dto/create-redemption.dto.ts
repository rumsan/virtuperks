import { ApiProperty } from '@nestjs/swagger';
import { CreateRedemption, RedemptionStatus } from '@workspace/sdk/type';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRedemptionDto implements CreateRedemption {
  @ApiProperty()
  @IsString()
  userAddress: string;

  @ApiProperty()
  @IsString()
  rewardId: string;
  
  @ApiProperty()
  @IsNumber()
  tokens: number; 

  @ApiProperty()
  @IsString()
    @IsOptional()
  transactionHash?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  status: RedemptionStatus;

  @ApiProperty()
  @IsOptional()
  @IsString()
  taskId?: string;

  
}

