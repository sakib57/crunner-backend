import { Module } from '@nestjs/common';
import { ScraperUrlService } from './scraper-url.service';
import { ScraperUrlController } from './scraper-url.controller';
import { ScraperUrlSchema } from './schemas/scraper-url.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserFollowService } from 'src/user-follow/user-follow.service';
import { UserFollowSchema } from 'src/user-follow/schemas/user-follow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ScraperUrl', schema: ScraperUrlSchema },
      { name: 'UserFollow', schema: UserFollowSchema },
    ]),
  ],
  controllers: [ScraperUrlController],
  providers: [ScraperUrlService, UserFollowService],
})
export class ScraperUrlModule {}
