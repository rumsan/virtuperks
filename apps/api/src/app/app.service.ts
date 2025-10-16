import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { allCaps } from '@workspace/sdk';
import { EVENTS } from "@workspace/sdk/constants";

@Injectable()
export class AppService {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  getHello(): string {
    this.eventEmitter.emit(EVENTS.HELLO, 'Hello World!');
    return allCaps('Hello World!');
  }
}
