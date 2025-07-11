import { Injectable } from '@nestjs/common';
import { CreateRedemptionDto } from './dto/create-redemption.dto';

@Injectable()
export class RedemptionService {
  findAll() {
    return [{ id: 1, user: 'Ngima', reward: 'Free Coffee' }];
  }

  create(dto: CreateRedemptionDto) {
    return  "hello"
  }
}
