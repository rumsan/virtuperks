import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { PrismaService } from '@rumsan/prisma';

import { ListenerModule } from "src/listeners/listener.module";
import { RedemptionModule } from "src/redemption/redemption.module";
import { RewardModule } from "src/reward/reward.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({
      maxListeners: 10,
      ignoreErrors: false,
    }),

    ListenerModule,
    RewardModule,           
    RedemptionModule       
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
