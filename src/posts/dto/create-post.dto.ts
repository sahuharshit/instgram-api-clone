import { IsNotEmpty, IsString } from 'class-validator';
import { Media } from 'src/media/entities/media.entity';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  caption: string;

  @IsNotEmpty()
  media: Media[];
}
