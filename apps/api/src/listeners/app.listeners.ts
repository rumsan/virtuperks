import { EVENTS } from '@app/sdk/events';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AppListener {
  private otp: string;
  private readonly logger = new Logger(AppListener.name);
  constructor(
    private config: ConfigService,
  ) {}

  @OnEvent(EVENTS.HELLO)
  async hello(message: string) {
      console.log('EVENT RECEIVED (DELETE THIS):', message);
  }
}
