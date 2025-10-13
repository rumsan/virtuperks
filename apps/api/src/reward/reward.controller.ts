import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { RewardService } from './reward.service';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  findAll() {
    return this.rewardService.findAll();
  }

  @Get(':cuid')
  findOne(@Param('cuid') cuid: string) {
   
    return this.rewardService.findOne(cuid);
  }

  @Post()
  create(@Body() payload: CreateRewardDto) {
    //return this.rewardService.create(payload);
  }



  @Put(':cuid')
update(@Param('cuid') cuid: string, @Body() dto: UpdateRewardDto) {
  return this.rewardService.update(cuid, dto);
}


  @Delete(':cuid')
  delete(@Param('cuid') cuid: string) {
    return this.rewardService.delete(cuid);
  }
}
