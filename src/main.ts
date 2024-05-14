import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { resolve } from "path";
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Create a new Swagger configuration with the DocumentBuilder
  const config = new DocumentBuilder()
    .setTitle('Instagram API') // Set the title of the API documentation
    .setVersion('1.0') // Set the version of the API
    .build(); // Build the Swagger configuration object
  // Create a Swagger document based on the application and the Swagger configuration
  const document = SwaggerModule.createDocument(app, config);
  
  const outputPath = resolve(__dirname, '../swagger.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2), { encoding: 'utf8' });

  // Setup the Swagger module with the created document at the 'api' endpoint
  SwaggerModule.setup('api', app, document);

  // start the application on PORT 3000
  await app.listen(3000);
}
bootstrap();
