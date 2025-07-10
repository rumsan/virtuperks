import { ApiProperty } from '@nestjs/swagger';
import type { Reward } from '@sdk/src/types/reward.type';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRewardDto implements Omit<Reward, 'cuid' | 'createdAt' | 'updatedAt' | 'redemptions'> {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  tokens: number; // Note: change to string if your schema uses BigInt

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
