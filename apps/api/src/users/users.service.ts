import { Injectable } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select:{
        cuid:true,
        wallet: true,
        details: {
          select: {
            cuid:true,
            name:true 
          }
        }
      }
    });
    return users
  }

  
}
