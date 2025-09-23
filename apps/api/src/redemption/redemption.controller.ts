import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateRedemptionDto } from './dto/create-redemption.dto';
import { ListRedemptionDto } from './dto/list-redemption.dto';
import { RedemptionFilterDto } from './dto/redemption-filter.dto';
import { RedemptionService } from './redemption.service';

@Controller('redemption')
export class RedemptionController {
  constructor(private readonly redemptionService: RedemptionService) {}

  @Get()
  findAll(
    @Query() listDto: ListRedemptionDto,
    @Query() filters: RedemptionFilterDto,
  ) {
    return this.redemptionService.findAll(listDto, filters);
  }

@Post('search')
async listCategoryWithFilter(
    @Query() query: ListRedemptionDto,
    @Body() filters: RedemptionFilterDto,
  
  ) {
  const data = await this.redemptionService.findAll(query, filters);
  return  data
  }

  @Post()
  create(@Body() payload: CreateRedemptionDto) {
    return this.redemptionService.create(payload);
  }
}
