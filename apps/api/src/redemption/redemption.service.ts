import { Injectable } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { CreateRedemptionDto } from './dto/create-redemption.dto';

@Injectable()
export class RedemptionService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return  this.prisma.redemption.findMany();
  }

  async create(dto: CreateRedemptionDto) {
    const redemption = await this.prisma.redemption.create({
      data: dto,
    });
  
    return redemption;
  }
  
}
