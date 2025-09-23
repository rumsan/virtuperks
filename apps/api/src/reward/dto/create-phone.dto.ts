import { ApiProperty } from '@nestjs/swagger';
import { CreatePhone } from '@workspace/sdk/type';
import { IsString } from 'class-validator';

export class CreatePhoneDto implements CreatePhone {
  @ApiProperty({ description: 'Phone number of the user' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'Wallet address of the user' })
  @IsString()
  userWalletAddress: string;

}