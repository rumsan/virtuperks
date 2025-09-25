import { Injectable } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Injectable()
export class RewardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const rewards = await this.prisma.reward.findMany();
    return rewards
  }

  async findOne(cuid: string) {
    const reward = await this.prisma.reward.findUnique({ where: { cuid } });
 
    return reward;
  }

 async findPhonebyWallet(userWalletAddress: string) {
    const phone = await this.prisma.phone.findUnique({ where: { userWalletAddress } });
    return phone;
  }

  // async create(dto: CreateRewardDto) {
  //   const reward = await this.prisma.reward.create({ data: dto });
  //   return reward;
  // }

    async createPhone(dto: CreatePhoneDto) {
      // Check if phone number already exists
      const existingPhone = await this.prisma.phone.findUnique({
        where: { phoneNumber: dto.phoneNumber },
      });
  
      if (existingPhone) {
        return {
          phone: existingPhone,
          status: 'already_exists',
          message: 'Phone number already exists'
        };
      }
  
      const phone = await this.prisma.phone.create({
        data: {
          phoneNumber: dto.phoneNumber,
          userWalletAddress: dto.userWalletAddress,
        },
      });
  
      return {
        phone,
        status: 'created',
        message: 'Phone number created successfully'
      };
    }

  async update(cuid: string, dto: UpdateRewardDto) {
    const reward = await this.prisma.reward.update({
      where: { cuid },
      data: dto,
    });
    return reward;
  }
  

  async delete(cuid: string) {
    const reward = await this.prisma.reward.delete({ where: { cuid } });
    return { message: `Reward Deleted Successfully!` };
  }
}
