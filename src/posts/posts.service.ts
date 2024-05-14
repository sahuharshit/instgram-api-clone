import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { Media } from 'src/media/entities/media.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private usersService: UsersService,
    private dataSource: DataSource,
  ) {}

  async create(req: Request, createPostDto: CreatePostDto): Promise<Post> {
    const token = req.headers.authorization.split(' ')[1];
    const decode = await this.usersService.decodeToken(token);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newPost = this.postsRepository.create({
        caption: createPostDto.caption,
        userId: decode.userID,
      });

      await queryRunner.manager.save(newPost);

      const mediaEntities = createPostDto.media.map((mediaDto) => {
        return this.mediaRepository.create({
          ...mediaDto,
          post: newPost,
        });
      });

      await queryRunner.manager.save(mediaEntities);

      await queryRunner.commitTransaction();
      return newPost;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find({ relations: ['media'] });
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
