import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { FacebookModule } from './modules/facebook/facebook.module';
import { InstagramModule } from './modules/instagram/instagram.module';
import { SholatModule } from './modules/sholat/sholat.module';
import { TiktokModule } from './modules/tiktok/tiktok.module';
import { UserModule } from './modules/user/user.module';
import { WebpModule } from './modules/webp/webp.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    SholatModule,
    InstagramModule,
    FacebookModule,
    TiktokModule,
    WebpModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
