import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UsersModule } from 'src/users/users.module';
import { Media } from 'src/media/entities/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UsersModule, TypeOrmModule.forFeature([Media])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule { }
