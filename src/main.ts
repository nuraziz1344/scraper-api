import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appEnv = configService.get<string>('APP_ENV');

  if (appEnv === 'development') {
    app.enableCors();

    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('scraping API')
      .setVersion('1.0')
      .addBearerAuth()
      .addApiKey({ type: 'apiKey' }, 'apikey')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);
  }

  const host = configService.get<string>('HOST');
  const port = configService.get<number>('PORT');

  await app.listen(port, host);

  if (appEnv === 'development') {
    Logger.log('Swagger is running on http://localhost:3000/docs', 'Bootstrap');
  }
  Logger.log(`Server running on http://${host}:${port}`, 'Bootstrap');
}
bootstrap();
