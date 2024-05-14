import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileServicesService } from './file-services.service';
import { JwtAuthGuard } from 'src/users/guard/jwt-auth.guard';

@ApiTags('File Service')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('file-services')
export class FileServicesController {
  constructor(private readonly fileServicesService: FileServicesService) {}

  @Get('/file/signed-s3-url/generate')
  getSignedUrl(@Query('key') key?: string): Promise<string> {
    return this.fileServicesService.getUserUploadsSignedUrl(key);
  }
}
