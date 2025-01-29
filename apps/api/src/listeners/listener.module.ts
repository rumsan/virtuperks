import { Module } from '@nestjs/common';
import { AppListener } from './app.listeners';

@Module({
  providers: [AppListener],
})
export class ListenerModule {}
