import { Controller } from '@nestjs/common';
import { WebpService } from './webp.service';

@Controller('webp')
export class WebpController {
  constructor(private readonly webpService: WebpService) {}
}
