import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateRedemptionDto, UpdateRedemptionDto } from './dto/create-redemption.dto';
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
async listRedemptionWithFilter(
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
  @Put(':cuid')
  update(@Param('cuid') cuid: string, @Body() payload: UpdateRedemptionDto) {
  
    return this.redemptionService.update(cuid, payload);
  }
}
