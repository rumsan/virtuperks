import { Injectable } from '@nestjs/common';

@Injectable()
export class RedemptionService {
  findAll() {
    return [{ id: 1, user: 'Ngima', reward: 'Free Coffee' }];
  }

  create(data: any) {
    return { message: 'Redemption created', data };
  }
}
