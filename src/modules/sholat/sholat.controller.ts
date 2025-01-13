import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SholatService } from './sholat.service';

@ApiTags('Jadwal Sholat')
@Controller('sholat')
export class SholatController {
  constructor(private readonly sholatService: SholatService) {}

  @Get()
  async getJadwalSholat(@Query('id_kota') idKota: string) {
    return await this.sholatService.jadwalSholat(idKota);
  }

  @Get('list-kota')
  async getListKota() {
    return await this.sholatService.listKota();
  }
}
