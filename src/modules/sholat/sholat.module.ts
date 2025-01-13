import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SholatController } from './sholat.controller';
import { SholatService } from './sholat.service';

@Module({
  imports: [HttpModule],
  controllers: [SholatController],
  providers: [SholatService],
})
export class SholatModule {}
