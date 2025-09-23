import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { CreateRedemptionDto } from './dto/create-redemption.dto';
import { ListRedemptionDto } from './dto/list-redemption.dto';

import { paginator, PaginatorTypes } from '@rumsan/sdk/utils';
import { RedemptionFilterDto } from './dto/redemption-filter.dto';
const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });
@Injectable()
export class RedemptionService {
  constructor(private prisma: PrismaService) {}

  async findAll(dto: ListRedemptionDto, filters?: RedemptionFilterDto) {
    const orderBy = {};
    dto.sort = dto.sort || 'createdAt';
    dto.order = dto.order || 'desc';
    if (dto.sort) {
      orderBy[dto.sort] = dto.order;
    }

    const where = {
      deletedAt: null, // No deletedAt field in Redemption model
    }
    // Apply filters
    if (filters?.rewardId) {
      where['rewardId'] = filters.rewardId;
    }
    
    
    if (filters?.phoneNumber) {
      where['phone'] = {
        phoneNumber: {
          contains: filters.phoneNumber,
          mode: 'insensitive',
        },
      };
    }
    
    if (filters?.walletAddress) {
      where['phone'] = {
        ...where['phone'],
        userWalletAddress: {
          contains: filters.walletAddress,
          mode: 'insensitive',
        },
      };
    }

 

    return  await  paginate(
        this.prisma.redemption,
      {
        where,
        orderBy,
        include: {
          reward: true,
          phone: true,
        },
      },
      { page: dto.page , perPage: dto.limit },
    );
    
  }

  async findOne(cuid: string) {
    const redemption = await this.prisma.redemption.findUnique({
      where: { cuid },
      include: {
        reward: true,
        phone: true,
      },
    });

    if (!redemption) {
      throw new NotFoundException('Redemption not found');
    }

    return redemption;
  }

  async findByPhoneNumber(phoneNumber: string) {
    const phone = await this.prisma.phone.findUnique({
      where: { phoneNumber },
    });

    if (!phone) {
      throw new NotFoundException('Phone number not registered');
    }

    return this.prisma.redemption.findMany({
      where: { phoneId: phone.cuid },
      include: {
        reward: true,
        phone: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByRewardAndWallet(rewardId: string, walletAddress: string) {
    const redemptions = await this.prisma.redemption.findMany({
      where: {
        rewardId,
        phone: {
          userWalletAddress: walletAddress,
        },
      },
      include: {
        reward: true,
        phone: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return redemptions;
  }

  async create(dto: CreateRedemptionDto) {
   console.log(dto, "dto");
   
    const reward = await this.prisma.reward.findUnique({
      where: { cuid: dto.rewardId },
    });

    

    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    if (!reward.isActive) {
      throw new BadRequestException('Reward is not active');
    }

    const phone = await this.prisma.phone.findUnique({
      where: { phoneNumber: dto.phoneNumber },
    });

    if (!phone) {
      throw new NotFoundException('Phone not found');
    }
   const redemption = await this.prisma.redemption.create({
      data: {
        rewardId: dto.rewardId,
        phoneId: phone?.cuid,
        transactionHash: dto.transactionHash,
        status: 'PENDING',
      },
    });

    return redemption;
  }

 
  // Method to check if user can redeem (phone is registered)
  // async canUserRedeem(phoneNumber: string): Promise<{
  //   canRedeem: boolean;
  //   phone?: any;
  //   message: string;
  // }> {
  //   const phone = await this.prisma.phone.findUnique({
  //     where: { phoneNumber },
  //   });

  //   if (!phone) {
  //     return {
  //       canRedeem: false,
  //       message: 'Phone number not registered. Please register first.',
  //     };
  //   }

  //   if (!phone.isVerified) {
  //     return {
  //       canRedeem: false,
  //       phone,
  //       message: 'Phone number not verified. Please verify your phone number first.',
  //     };
  //   }

  //   return {
  //     canRedeem: true,
  //     phone,
  //     message: 'User can redeem rewards.',
  //   };
  // }
}
