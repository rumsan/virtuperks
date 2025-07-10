import { Module } from '@nestjs/common';
import { RedemptionController } from './redemption.controller';
import { RedemptionService } from './redemption.service';

@Module({
  providers: [RedemptionService],
  controllers: [RedemptionController],
})
export class RedemptionModule {}
