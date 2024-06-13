import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { CategoryDocument } from 'src/category/schemas/category.schema';

export type NoticeDocument = Notice & Document;

@Schema()
export class Notice {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: CategoryDocument;

  @Prop()
  sl: string;

  @Prop()
  linkTitle: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  url: string;

  @Prop()
  publishedDate: number;

  @Prop()
  file: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now() })
  cTime: number;

  @Prop()
  cBy: string;

  @Prop({ default: Date.now() })
  uTime: number;

  @Prop()
  uBy: string;
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);
