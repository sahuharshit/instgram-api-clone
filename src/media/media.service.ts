import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media, MediaType } from './entities/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}

  async create(
    postId: number,
    url: string,
    mediaType: MediaType,
  ): Promise<Media> {
    const newMedia = this.mediaRepository.create({
      postId,
      url,
      mediaType,
    });
    return this.mediaRepository.save(newMedia);
  }

  async findAllByPost(postId: number): Promise<Media[]> {
    return this.mediaRepository.find({
      where: { postId: postId },
    });
  }
  async findOne(id: number): Promise<Media> {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    return media;
  }

  async remove(id: number): Promise<void> {
    const media = await this.findOne(id);
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    await this.mediaRepository.delete(id);
  }
}
