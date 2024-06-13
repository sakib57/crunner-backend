import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScraperUrlSchema } from '../scraper-url/schemas/scraper-url.schema';
import { UserFollowSchema } from '../user-follow/schemas/user-follow.schema';
import { ScrapingController } from './scraping.controller';
import { ScrapingService } from './scraping.service';
import { NoticeSchema } from '../notices/notices.schema';
import { NoticesService } from '../notices/notices.service';
import { PushNotificationService } from 'src/push-notification/push-notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ScraperUrl', schema: ScraperUrlSchema },
      { name: 'UserFollow', schema: UserFollowSchema },
      { name: 'Notice', schema: NoticeSchema },
    ]),
  ],
  controllers: [ScrapingController],
  providers: [ScrapingService, NoticesService, PushNotificationService],
})
export class ScrapingModule {}
