import { ApiProperty } from '@nestjs/swagger';
import { CreateReward } from '@workspace/sdk/type';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRewardDto implements CreateReward {
  name: string;
  tokensRequired: number;
  appId?: string | undefined;
  image?: string | undefined;
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  tokens: number; 

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  stock?: number;
}
