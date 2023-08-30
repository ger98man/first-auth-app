import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
import { LoginDto } from './dto/login.dto';

const BAD_CREDS_MSG = 'Bad credentials.';
const USER_EXISTS_MSG = 'User already exsists!';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(USER_EXISTS_MSG, HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const roles = user.roles.map((role) => role.value);
    const payload = { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, roles };
    return { token: this.jwtService.sign(payload) };
  }

  private async validateUser(loginDto: LoginDto) {
    const user = await this.userService.getUserByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException({ message: BAD_CREDS_MSG });

    const passwordEquals = await bcrypt.compare(loginDto.password, user.password);
    if (passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({ message: BAD_CREDS_MSG });
  }
}
