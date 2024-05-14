import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  controllers: [],
  providers: [],
})
export class MediaModule {}
