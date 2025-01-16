import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { fromBuffer } from 'file-type';
import { readdirSync, unlinkSync, writeFileSync } from 'fs';
import parse from 'node-html-parser';
import { join } from 'path';
import xbogus from 'xbogus';
const fbDl = require('fb-downloader-scrapper');
const igDl = require('instagram-url-direct');

@Injectable()
export class DownloaderService {
  private TIKTOK_HEADER = {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9,id;q=0.8',
    priority: 'u=1, i',
    'sec-ch-ua':
      '"Not)A;Brand";v="99", "Microsoft Edge";v="127", "Chromium";v="127"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Linux"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'User-Agent':
      'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.1',
  };

  constructor(private readonly httpService: HttpService) {}

  async facebook(url: string) {
    return fbDl(url).then((data) => data['hd'] || data['sd']);
  }

  async tiktok(url: string) {
    return this.httpService.axiosRef
      .get(url, { headers: this.TIKTOK_HEADER })
      .then(async ({ data, headers, request }) => {
        if (/tiktok\.com\/(.*?)\/photo\//gm.test(request.res.responseUrl)) {
          return this.tiktokSlide(url);
        } else if (
          !/tiktok\.com\/(.*?)\/video\//gm.test(request.res.responseUrl)
        ) {
          throw new BadRequestException('Invalid Tiktok URL');
        }
        const cookie = headers['set-cookie']
          .map((cookie) => cookie.split(';')[0])
          .join('; ');
        const res = parse(data).querySelector(
          'script#__UNIVERSAL_DATA_FOR_REHYDRATION__',
        ).text;
        const videoDetail =
          JSON.parse(res)['__DEFAULT_SCOPE__']['webapp.video-detail'][
            'itemInfo'
          ]['itemStruct'];
        const caption = videoDetail['desc'];
        const downloadUrl =
          videoDetail['video']['downloadAddr'] ||
          videoDetail['video']['playAddr'];

        if (!downloadUrl) {
          throw new InternalServerErrorException('Failed to get download URL');
        }
        const buf = await this.httpService.axiosRef.get(downloadUrl, {
          responseType: 'arraybuffer',
          headers: { ...this.TIKTOK_HEADER, cookie },
        });

        const video = await this.saveTemp(Buffer.from(buf.data));
        return { caption, video };
      });
  }

  async tiktokSlide(url: string) {
    return this.httpService.axiosRef
      .get(url, { headers: this.TIKTOK_HEADER })
      .then(({ data, request }) => {
        const odinId = /"odinId":"(.*?)"/s.exec(data)[1];
        const itemId = /tiktok\.com\/(.*?)\/photo\/(.*?)\?/gm.exec(
          request.res.responseUrl,
        )[2];
        const webIdLastTime = /"webIdCreatedTime":"(.*?)"/s.exec(data)[1];
        const deviceId = /"wid":"(.*?)"/s.exec(data)[1];
        const detailUrl = `https://www.tiktok.com/api/item/detail/?WebIdLastTime=${webIdLastTime}&aid=1988&app_language=en&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Linux%20x86_64&browser_version=5.0%20%28X11%3B%20Linux%20x86_64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F127.0.0.0%20Safari%2F537.36%20Edg%2F127.0.0.0&channel=tiktok_web&clientABVersions=70508271&clientABVersions=72213608&clientABVersions=72313476&clientABVersions=72406134&clientABVersions=72422414&clientABVersions=72507665&clientABVersions=72516864&clientABVersions=72556483&clientABVersions=72602618&clientABVersions=72607426&clientABVersions=72612481&clientABVersions=72619473&clientABVersions=72620774&clientABVersions=72637610&clientABVersions=72637703&clientABVersions=72651443&clientABVersions=72653054&clientABVersions=70405643&clientABVersions=71057832&clientABVersions=71200802&clientABVersions=72258247&clientABVersions=72445639&cookie_enabled=true&coverFormat=2&data_collection_enabled=false&device_id=${deviceId}&device_platform=web_pc&focus_state=true&from_page=user&history_len=2&is_fullscreen=false&is_page_visible=true&itemId=${itemId}&language=en&odinId=${odinId}&os=linux&priority_region=&referer=&region=SG&screen_height=1080&screen_width=1920&tz_name=Asia%2FJakarta&user_is_login=false&webcast_language=en`;
        const tiktok_xbogus = xbogus(
          detailUrl,
          this.TIKTOK_HEADER['User-Agent'],
        );

        return this.httpService.axiosRef
          .get(detailUrl + '&X-Bogus=' + tiktok_xbogus, {
            headers: this.TIKTOK_HEADER,
          })
          .then(({ data }) => {
            const caption = data['itemInfo']['itemStruct']['desc'];
            const images = data['itemInfo']['itemStruct']['imagePost'][
              'images'
            ].map((image) => image['imageURL']['urlList'][0]);
            return { caption: caption, images };
          });
      });
  }

  async instagram(url: string) {
    return igDl(url).then((res) => ({
      caption: res.post_info.caption,
      media: res.media_details,
    }));
  }

  async saveTemp(buffer: Buffer) {
    const type = await fromBuffer(buffer);
    const fileName = join('temp', `${Date.now()}.${type.ext}`);
    writeFileSync(fileName, buffer);
    return `/${fileName}`;
  }

  async clearTemp() {
    // const expiration = 1000 * 60 * 30;
    const expiration = 1000 * 60 * 3;
    const files = readdirSync('temp');
    for (const file of files) {
      if (file !== '.gitkeep') {
        try {
          const timestamp = parseInt(file.split('.')[0]);
          if (Date.now() - timestamp > expiration) {
            // 30 minutes
            unlinkSync(join('temp', file));
          }
        } catch (error) {}
      }
    }
  }
}
