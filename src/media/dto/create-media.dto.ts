import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '../entities/media.entity';

export class CreateMediaDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the post the media belongs to',
  })
  postId: number;

  @ApiProperty({
    example: 'http://example.com/image.jpg',
    description: 'URL of the media file',
  })
  url: string;

  @ApiProperty({
    example: MediaType.IMAGE,
    description: 'Type of media (image or video)',
  })
  mediaType: MediaType;
}
