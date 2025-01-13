import { Module } from '@nestjs/common';
import { WebpService } from './webp.service';
import { WebpController } from './webp.controller';

@Module({
  controllers: [WebpController],
  providers: [WebpService],
})
export class WebpModule {}
