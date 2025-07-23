import { Module } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { RewardController } from './users.controller';
import { RewardService } from './users.service';

@Module({
  controllers: [RewardController],
  providers: [RewardService, PrismaService], 
})
export class RewardModule {}
