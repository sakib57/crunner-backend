import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { ScraperUrlDocument } from 'src/scraper-url/schemas/scraper-url.schema';
import { UserDocument } from 'src/users/users.schema';

export type UserFollowDocument = UserFollow & Document;

@Schema()
export class UserFollow {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  })
  user: UserDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'ScraperUrl',
    required: true,
  })
  url: ScraperUrlDocument;
}

export const UserFollowSchema = SchemaFactory.createForClass(UserFollow);
