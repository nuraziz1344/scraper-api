import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DownloaderModule } from './modules/downloader/downloader.module';
import { SholatModule } from './modules/sholat/sholat.module';
import { UserModule } from './modules/user/user.module';
import { WebpModule } from './modules/webp/webp.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'temp'),
      serveRoot: '/temp',
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    SholatModule,
    WebpModule,
    UserModule,
    AuthModule,
    DownloaderModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
