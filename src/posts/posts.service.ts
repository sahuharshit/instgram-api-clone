import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  async create(req: Request, createPostDto: CreatePostDto): Promise<Post> {
    const token = req.headers.authorization.split(' ')[1];
    const decode = await this.usersService.decodeToken(token);
    const newPost = this.postsRepository.create({
      ...createPostDto,
      userId: decode.userID,
    });
    return this.postsRepository.save(newPost);
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }
  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: number, updatePostDto: CreatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    this.postsRepository.merge(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    this.postsRepository.delete(id);
  }
}
