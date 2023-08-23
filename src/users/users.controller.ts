import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.model';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesAuthGuard } from 'src/auth/roles-auth.guard';

@ApiTags('Users')
@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 200, type: User })
  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesAuthGuard)
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('USER')
  @UseGuards(RolesAuthGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }
}
