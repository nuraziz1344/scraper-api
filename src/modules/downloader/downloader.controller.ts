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

  @Get('instagram')
  @ApiKey()
  @ApiSecurity('apikey')
  async instagram(@Query('url') url: string) {
    return this.downloaderService.instagram(url);
  }

  @Cron('* * * * *')
  async clearTemp() {
    this.downloaderService.clearTemp();
  }

  @Get('youtube')
  @ApiKey()
  @ApiSecurity('apikey')
  async youtube(@Query('url') url: string) {
    return this.downloaderService.youtube(url);
  }

  @Get('youtube/search')
  @ApiKey()
  @ApiSecurity('apikey')
  async youtubeSearch(@Query('query') query: string) {
    return this.downloaderService.youtubeSearch(query);
  }
}
