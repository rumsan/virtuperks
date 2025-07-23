import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { PrismaService } from '@rumsan/prisma';

import { ListenerModule } from "src/listeners/listener.module";
import { RewardModule } from "src/users/users.module";

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
      
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
