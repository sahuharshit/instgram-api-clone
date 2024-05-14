import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MediaService } from './media.service';
import { Media } from './entities/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';

@ApiTags('media')
@ApiBearerAuth('access-token')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiOperation({ summary: 'Add media to a post' })
  @ApiCreatedResponse({
    description: 'Media has been successfully added.',
    type: Media,
  })
  async addMedia(@Body() createMediaDto: CreateMediaDto): Promise<Media> {
    return this.mediaService.create(
      createMediaDto.postId,
      createMediaDto.url,
      createMediaDto.mediaType,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all media for a specific post' })
  @ApiResponse({
    status: 200,
    description: 'List of media for the post',
    type: [Media],
  })
  async getMediaByPost(@Query('postId') postId: number): Promise<Media[]> {
    return this.mediaService.findAllByPost(postId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single media item by ID' })
  @ApiResponse({ status: 200, description: 'The media item', type: Media })
  async getMedia(@Param('id') id: number): Promise<Media> {
    return this.mediaService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a media item' })
  @ApiResponse({ status: 200, description: 'Media has been deleted' })
  async deleteMedia(@Param('id') id: number): Promise<void> {
    return this.mediaService.remove(id);
  }
}
