import { EVENTS } from '@app/sdk/events';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { allCaps } from 'node_modules/@app/sdk/dist';

@Injectable()
export class AppService {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  getHello(): string {
    this.eventEmitter.emit(EVENTS.HELLO, 'Hello World!');
    return allCaps('Hello World!');
  }
}
