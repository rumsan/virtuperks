import { Injectable } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-users.dto';
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



  async update(cuid: string, dto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { cuid },
      include: { details: true },
    });
  
    if (!existingUser) {
      throw new Error('User not found');
    }
  
    return this.prisma.user.update({
      where: { cuid },
      data: {
        email: dto.email ?? existingUser.email,
        phone: dto.phone ?? existingUser.phone,
        wallet: dto.wallet ?? existingUser.wallet,
        details: existingUser.details
          ? {
              update: {
                name: dto.name ?? existingUser.details.name,
                departmentId: dto.departmentId ?? existingUser.details.departmentId,
              },
            }
          : {
              create: {
                name: dto.name ?? '',
                departmentId: dto.departmentId ?? '',
              },
            },
      },
      include: {
        details: true,
      },
    });
  }
  
  
  
}
