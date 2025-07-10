import { Body, Controller, Get, Post } from '@nestjs/common';
import { RedemptionService } from './redemption.service';

@Controller('redemption')
export class RedemptionController {
  constructor(private readonly redemptionService: RedemptionService) {}

  @Get()
  findAll() {
    return this.redemptionService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.redemptionService.create(body);
  }
}
