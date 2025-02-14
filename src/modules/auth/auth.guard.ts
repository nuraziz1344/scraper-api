import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';

const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);

const USE_APIKEY = 'useApiKey';
export const ApiKey = () => SetMetadata(USE_APIKEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const useApiKey = this.reflector.getAllAndOverride<boolean>(USE_APIKEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const apiKey = context.switchToHttp().getRequest().headers['apikey'];
    if (useApiKey && apiKey) {
      return this.verifyApiKey(request, apiKey);
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env['JWT_SECRET'],
      });

      const user = await this.prisma.user.findFirst({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      delete user.password;
      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyApiKey(request: Request, apikey: string) {
    if (apikey == process.env.API_KEY) {
      return true;
    }

    const user = await this.prisma.user.findFirst({ where: { apikey } });
    if (!user) {
      throw new UnauthorizedException();
    }

    delete user.password;
    request['user'] = user;
    return true;
  }
}
