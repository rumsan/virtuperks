import { ApiProperty } from '@nestjs/swagger';
import { CreateReward } from '@workspace/sdk/type';

import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRewardDto implements CreateReward {

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  tokens: number; 

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsString()
  wallet: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

}
