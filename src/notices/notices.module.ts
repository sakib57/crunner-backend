import { Module } from '@nestjs/common';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';
import { NoticeSchema } from './notices.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserFollowSchema } from '../user-follow/schemas/user-follow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Notice', schema: NoticeSchema },
      { name: 'UserFollow', schema: UserFollowSchema },
    ]),
  ],
  controllers: [NoticesController],
  providers: [NoticesService],
})
export class NoticesModule {}
