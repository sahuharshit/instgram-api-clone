/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from 'src/decorators/public.decorator';

@ApiTags('Auth')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @Public()
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
  @Public()
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
  @Public()
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
  async login(@Req() req: any, @Body() loginUserDto: LoginUserDto) {
    return this.userService.login(req, loginUserDto);
  }
}
