import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { CategoryDocument } from 'src/category/schemas/category.schema';

export type ScraperUrlDocument = ScraperUrl & Document;

@Schema()
export class ScraperUrl {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: CategoryDocument;

  @Prop({ required: true, unique: true })
  url: string;

  @Prop()
  title: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: Date.now() })
  cTime: number;

  @Prop()
  cBy: string;

  @Prop({ default: Date.now() })
  uTime: number;

  @Prop()
  uBy: string;

  @Prop({ default: Date.now() })
  dTime: number;

  @Prop()
  dBy: string;
}

export const ScraperUrlSchema = SchemaFactory.createForClass(ScraperUrl);
