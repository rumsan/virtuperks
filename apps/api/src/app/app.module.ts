import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ListenerModule } from "src/listeners/listener.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({
      maxListeners: 10,
      ignoreErrors: false,
    }),
    ListenerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
