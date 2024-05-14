import { Module } from '@nestjs/common';
import { FileServicesService } from './file-services.service';
import { FileServicesController } from './file-services.controller';

import AwsS3Provider from '../provider/s3Bucket';

@Module({
  controllers: [FileServicesController],
  providers: [FileServicesService, AwsS3Provider],
  exports: [FileServicesService],
})
export class FileServicesModule {}
