import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { MediaModule } from './media/media.module';
import { JWTModule } from './utils/auth';
import { JwtAuthGuard } from './users/guard/jwt-auth.guard';
import { FileServicesModule } from './file-services/file-services.module';

config();

const TYPE_ORM_IMPORT = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  logging: true,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'instagram',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true' || true,
});

@Module({
  imports: [
    TYPE_ORM_IMPORT,
    UsersModule,
    PostsModule,
    MediaModule,
    FileServicesModule,
    JWTModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    try {
      console.log('Database connected successfully!');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
}
