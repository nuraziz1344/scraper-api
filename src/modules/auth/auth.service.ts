import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma.service';
import { RegisterBodyDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  generateApikey(length: number = 16) {
    return randomBytes(length).toString('base64').slice(0, length);
  }

  async register(data: RegisterBodyDto) {
    const apikey = this.generateApikey();
    const password = await hash(data.password, 12);

    await this.prisma.user.create({
      data: { ...data, apikey, password },
    });
    return true;
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: username }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password!');
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid username or password!');
    }

    const payload = { userId: user.id, username: user.username };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async checkApikey(apikey: string) {
    const user = await this.prisma.user.findFirst({
      where: { apikey: apikey },
    });

    if (!user) return false;
    delete user.password;
    return user;
  }
}
