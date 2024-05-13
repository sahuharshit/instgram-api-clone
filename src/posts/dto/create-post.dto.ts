import { ApiProperty } from '@nestjs/swagger';
import { CreateMediaDto } from 'src/media/dto/create-media.dto';

export class CreatePostDto {
  @ApiProperty({
    example: 'Test Description',
    description: 'Test Caption for the POST',
  })
  caption: string;

  @ApiProperty({ type: [CreateMediaDto] })
  media: CreateMediaDto[];
}
