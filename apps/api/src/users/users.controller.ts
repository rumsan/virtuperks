import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserFilterDto } from './dto/list-user.dto';
import { UpdateRewardDto } from './dto/update-users.dto';
import { RewardService } from './users.service';

@Controller('users')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  findAll(@Query() filter: UserFilterDto) {
    return this.rewardService.findAll(filter);
  }

  @Get(':cuid')
  findOne(@Param('cuid') cuid: string) {
    return this.rewardService.findOne(cuid);
  }

//   @Post()
//   create(@Body() payload: CreateRewardDto) {
//     return this.rewardService.create(payload);
//   }

//   @Put(':cuid')
// update(@Param('cuid') cuid: string, @Body() dto: UpdateRewardDto) {
//   return this.rewardService.update(cuid, dto);
// }


//   @Delete(':cuid')
//   delete(@Param('cuid') cuid: string) {
//     return this.rewardService.delete(cuid);
//   }
}
