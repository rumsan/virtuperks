import { Injectable } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  findOne(cuid: string) {
    throw new Error('Method not implemented.');
  }
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



  // async findOne(cuid: string) {
  //   return this.prisma.user.findUnique({
  //     where: { cuid },
  //     include: {
  //       details: true,
  //     },
  //   });
  // }

  async findByWallet(wallet: string) {
    return this.prisma.user.findFirst({  //can be filtered even if the null data
      where: { wallet },
      include: {
        details: true,
      },
    });
  }
  
    


  async create(dto: CreateUserDto) {
    const cuid = `c${Math.random().toString(36).substr(2, 9)}`;
  
    return this.prisma.user.create({
      data: {
        cuid,
        email: dto.email,
        phone: dto.phone,
        wallet: dto.wallet,
        details: {
          create: {
            name: dto.name,
            departmentId: dto.departmentId,
          },
        },
      },
      include: {
        details: true,
      },
    });
  }
  
  
}
