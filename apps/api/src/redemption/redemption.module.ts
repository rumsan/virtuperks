import { Module } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { RedemptionController } from './redemption.controller';
import { RedemptionService } from './redemption.service';

@Module({
  providers: [RedemptionService, PrismaService],
  controllers: [RedemptionController],
})
export class RedemptionModule {}
