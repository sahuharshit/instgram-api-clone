import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JWTModule } from 'src/utils/auth';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JWTModule],
  controllers: [UserController],
  providers: [UsersService],
})
export class UsersModule {}
