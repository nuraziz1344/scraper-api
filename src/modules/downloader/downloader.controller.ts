import { Controller, Get, Query } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKey } from '../auth/auth.guard';
import { DownloaderService } from './downloader.service';

@ApiTags('Downloader')
@Controller('downloader')
export class DownloaderController {
  constructor(private readonly downloaderService: DownloaderService) {}

  @Get('facebook')
  @ApiKey()
  @ApiSecurity('apikey')
  async facebook(@Query('url') url: string) {
    return this.downloaderService.facebook(url);
  }

  @Get('tiktok')
  @ApiKey()
  @ApiSecurity('apikey')
  async tiktok(@Query('url') url: string) {
    return this.downloaderService.tiktok(url);
  }

  @Cron('* * * * *')
  async clearTemp() {
    this.downloaderService.clearTemp();
  }
}
