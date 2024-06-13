import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScraperUrlSchema } from 'src/scraper-url/schemas/scraper-url.schema';
import { UserFollowSchema } from './schemas/user-follow.schema';
import { UserFollowController } from './user-follow.controller';
import { UserFollowService } from './user-follow.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserFollow', schema: UserFollowSchema },
      { name: 'ScraperUrl', schema: ScraperUrlSchema },
    ]),
  ],
  controllers: [UserFollowController],
  providers: [UserFollowService],
})
export class UserFollowModule {}
