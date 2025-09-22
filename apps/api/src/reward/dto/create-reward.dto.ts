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
  @IsString()
  wallet: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

}
