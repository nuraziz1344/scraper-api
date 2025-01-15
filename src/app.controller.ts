import { Controller, Get } from '@nestjs/common';
import { Public } from './modules/auth/auth.guard';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Public()
  default(): string {
    return new Date().toLocaleString();
  }
}
