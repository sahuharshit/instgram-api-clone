import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { compare } from 'bcryptjs';

@ApiTags('Auth')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: User,
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      a: {
        summary: 'Example user',
        value: {
          username: 'johndoe',
          email: 'johndoe@example.com',
          password: 'password123',
        },
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User,
  })
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post('login')
  @ApiBody({
    type: LoginUserDto,
    examples: {
      validCredentials: {
        summary: 'Example of valid login credentials',
        value: {
          username: 'johndoe',
          password: 'password123',
        },
      },
      invalidCredentials: {
        summary: 'Example of invalid login credentials',
        value: {
          username: 'janedoe',
          password: 'incorrectpassword',
        },
      },
    },
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const access_token = await this.generateJWT(user);
    return { access_token };
  }

  async validateUser(
    username: string,
    hashedPassword: string,
  ): Promise<User | null> {
    const user = await this.userService.findByUsername(username);
    if (user && (await compare(hashedPassword, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async generateJWT(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      username: user.username,
      user_email: user.email,
    };
    return this.jwtService.signAsync(payload);
  }
}
