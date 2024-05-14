# How to Start the NestJS Application

Welcome to the setup guide for our NestJS application. This guide will help you get the application up and running quickly. The project uses a `.env` file for configuration, which I have hardcoded for simplicity. Feel free to change the values as needed.

## Prerequisites

1. **S3 Bucket**: Ensure you have an S3 bucket. The S3 configuration values should be picked up from the `.env` file.
2. **PostgreSQL**: You need to have PostgreSQL installed. Update the configuration in the `src/app.module.ts` file with your PostgreSQL credentials.

## Steps to Start the Application

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd <your-repo-directory>
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure the Environment Variables

Create a `.env` file in the root directory of your project with the necessary environment variables. For simplicity, I have hardcoded these values in the project. Feel free to update them as per your requirements.

### 4. Update PostgreSQL Configuration

Open the `src/app.module.ts` file and update the PostgreSQL configuration with your database details.

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Post } from './posts/entities/post.entity';
import { User } from './users/entities/user.entity';
import { Media } from './media/entities/media.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Post, User, Media],
      synchronize: true, // Automatically synchronize the schema
    }),
    // other imports...
  ],
  // other module settings...
})
export class AppModule {}
```

### 5. Start the Application

```sh
npm run start
```

### 6. Access Swagger API Documentation

Once the application is running, you can access the Swagger documentation at `http://localhost:3000/api`. This documentation includes all the examples and details on how to use the APIs, which will be helpful for frontend developers.