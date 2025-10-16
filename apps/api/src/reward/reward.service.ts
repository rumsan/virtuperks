import { Injectable } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Injectable()
export class RewardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const rewards = await this.prisma.reward.findMany();
    return rewards
  }

  async findOne(cuid: string) {
    const reward = await this.prisma.reward.findUnique({ where: { cuid } });
 
    return reward;
  }



  // async create(dto: CreateRewardDto) {
  //   const reward = await this.prisma.reward.create({ data: dto });
  //   return reward;
  // }


  async update(cuid: string, dto: UpdateRewardDto) {
    const reward = await this.prisma.reward.update({
      where: { cuid },
      data: dto,
    });
    return reward;
  }
  

  async delete(cuid: string) {
    const reward = await this.prisma.reward.delete({ where: { cuid } });
    return { message: `Reward Deleted Successfully!` };
  }
}
