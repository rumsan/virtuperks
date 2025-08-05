import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }


  @Get(':cuid')
findOne(@Param('cuid') cuid: string) {
  return this.usersService.findOne(cuid);
  }
  
  @Get('wallet/:wallet')
findByWallet(@Param('wallet') wallet: string) {
  return this.usersService.findByWallet(wallet);
}


@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}

  
}
