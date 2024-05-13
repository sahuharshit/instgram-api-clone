import { Body, Controller, Get, Post, Param } from '@nestjs/common';
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

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

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
}
