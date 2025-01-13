import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DownloaderController } from './downloader.controller';
import { DownloaderService } from './downloader.service';

@Module({
  controllers: [DownloaderController],
  providers: [DownloaderService],
  imports: [HttpModule],
})
export class DownloaderModule {}
