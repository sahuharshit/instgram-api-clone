import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileServicesService } from './file-services.service';
import { JwtAuthGuard } from 'src/users/guard/jwt-auth.guard';

@ApiTags('File Service')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('media-upload')
export class FileServicesController {
  constructor(private readonly fileServicesService: FileServicesService) {}

  @Get('/')
  getSignedUrl(@Query('key') key?: string): Promise<string> {
    return this.fileServicesService.createPresignedUrl(key, 'image/jpeg');
  }
}
