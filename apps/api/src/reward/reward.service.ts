import { Injectable } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Injectable()
export class RewardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const rewards = await this.prisma.reward.findMany();
    return rewards.map(r => ({ ...r, tokens: r.tokens.toString() }));
  }

  async findOne(cuid: string) {
    const reward = await this.prisma.reward.findUnique({ where: { cuid } });
    if (!reward) return null;
    return { ...reward, tokens: reward.tokens.toString() };
  }

  async create(dto: CreateRewardDto) {
    const reward = await this.prisma.reward.create({ data: dto });
    return { ...reward, tokens: reward.tokens.toString() };
  }

  async update(cuid: string, dto: UpdateRewardDto) {
    const reward = await this.prisma.reward.update({
      where: { cuid },
      data: dto,
    });
    return { ...reward, tokens: reward.tokens.toString() };
  }

  async delete(cuid: string) {
    const reward = await this.prisma.reward.delete({ where: { cuid } });
    return { message: 'Deleted', data: { ...reward, tokens: reward.tokens.toString() } };
  }
}
