import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { DownloaderService } from './downloader.service';

@ApiTags('Downloader')
@Controller('downloader')
export class DownloaderController {
  constructor(private readonly downloaderService: DownloaderService) {}

  @Get('facebook')
  async facebook(url: string) {
    return this.downloaderService.facebook(url);
  }

  @Get('tiktok')
  async tiktok(url: string) {
    return this.downloaderService.tiktok(url);
  }

  @Cron('* * * * *')
  async clearTemp() {
    this.downloaderService.clearTemp();
  }
}
