import {allCaps} from '@app/sdk';
import {EVENTS} from '@app/sdk/events';
import {Injectable} from '@nestjs/common';
import {EventEmitter2} from '@nestjs/event-emitter';

@Injectable()
export class AppService {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  getHello(): string {
    this.eventEmitter.emit(EVENTS.HELLO, 'Hello World!');
    return allCaps('Hello World!');
  }
}
