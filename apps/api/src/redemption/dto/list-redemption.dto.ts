import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListRedemptionDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @IsNumber() 
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sort?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';

}