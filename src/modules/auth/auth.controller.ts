import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { LoginBodyDto, RegisterBodyDto } from './auth.dto';
import { ApiKey, Public } from './auth.guard';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @Public()
  async register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body);
  }

  @Post('/login')
  @Public()
  async login(@Body() body: LoginBodyDto) {
    return this.authService.login(body.username, body.password);
  }

  @Get('/profile')
  @ApiBearerAuth()
  @ApiKey()
  @ApiSecurity('apikey')
  async profile(@Request() req: any) {
    return req.user;
  }
}
