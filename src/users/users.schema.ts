import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  mobile: string;

  @Prop()
  otp: number;

  @Prop()
  otpExpiresAt: number;

  @Prop()
  emailProofToken: string;

  @Prop()
  emailProofTokenExpiresAt: number;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetTokenExpiresAt: number;

  @Prop()
  fcmToken: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: false })
  isSuperAdmin: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isMobileVerified: boolean;

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

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      _id: ret._id,
      firstName: ret.firstName,
      lastName: ret.lastName,
      email: ret.email,
      mobile: ret.mobile,
      isActive: ret.isActive,
      isEmailVerified: ret.isEmailVerified,
      fcmToken: ret.fcmToken,
      isMobileVerified: ret.isMobileVerified,
      isSuperAdmin: ret.isSuperAdmin,
      isAdmin: ret.isAdmin,
    };
  },
});
