import { Body, Controller, Get, Post } from '@nestjs/common';
import { RedemptionService } from './redemption.service';
import { CreateRedemptionDto } from './dto/create-redemption.dto';

@Controller('redemption')
export class RedemptionController {
  constructor(private readonly redemptionService: RedemptionService) {}

  @Get()
  findAll() {
    return this.redemptionService.findAll();
  }

  @Post()
  create(@Body() payload: CreateRedemptionDto) {
    return this.redemptionService.create(payload);
  }
}
