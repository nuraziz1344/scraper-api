import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { parse } from 'node-html-parser';

@Injectable()
export class SholatService {
  constructor(private readonly httpService: HttpService) {}

  async listKota() {
    const response = await this.httpService.axiosRef.get(
      'https://jadwalsholat.org/jadwal-sholat/monthly.php',
    );
    const document = parse(response.data);

    return document.querySelectorAll('select[name=kota] option').map((el) => ({
      id: el.getAttribute('value'),
      nama: el.text,
    }));
  }

  async jadwalSholat(id: string = '307') {
    const response = await this.httpService.axiosRef.get(
      `https://jadwalsholat.org/jadwal-sholat/monthly.php?id=${id || '307'}`,
    );

    const document = parse(response.data);
    const jadwal = document.querySelector('tr.table_highlight');
    return {
      imsyak: jadwal.childNodes[1].text,
      subuh: jadwal.childNodes[2].text,
      terbit: jadwal.childNodes[3].text,
      dzuhur: jadwal.childNodes[5].text,
      ashar: jadwal.childNodes[6].text,
      maghrib: jadwal.childNodes[7].text,
      isya: jadwal.childNodes[8].text,
    };
  }
}
