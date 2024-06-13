import {
  Controller,
  Logger,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ScrapingService } from './scraping.service';

@Controller('scraping')
export class ScrapingController {
  private readonly logger = new Logger(ScrapingController.name);

  /**
   * Constructor
   * @param {ScrapingService} scrapingService
   */

  constructor(private readonly scrapingService: ScrapingService) {}

  @Cron('0 10,16 * * 0-4')
  @Get()
  Scrap() {
    try {
      this.logger.log('Scheduler is activated');
      return this.scrapingService.scrap();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
