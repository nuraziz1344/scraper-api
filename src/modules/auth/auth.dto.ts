import { ApiProperty } from '@nestjs/swagger';

export class RegisterBodyDto {
  @ApiProperty()
  fullname: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class LoginBodyDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
