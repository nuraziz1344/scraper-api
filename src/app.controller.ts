import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { ApiKey } from './modules/auth/auth.guard';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @ApiBearerAuth()
  @ApiKey()
  @ApiSecurity('apikey')
  default(): string {
    return new Date().toLocaleString();
  }
}
