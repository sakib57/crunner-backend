export interface IUser {
  readonly _id: string;
  readonly email: string;
  readonly password: string;
  readonly mobile: string;
  readonly otp: number;
  readonly otpExpiresAt: number;
  readonly emailProofToken: string;
  readonly emailProofTokenExpiresAt: number;
  readonly passwordResetToken: string;
  readonly passwordResetTokenExpiresAt: number;
  readonly fcmToken: string;
  readonly isAdmin: boolean;
  readonly isSuperAdmin: boolean;
  readonly isActive: boolean;
  readonly isEmailVerified: boolean;
  readonly isMoblieVerified: boolean;
  readonly isDeleted: boolean;
  readonly cTime: number;
  readonly cBy: string;
  readonly uTime: number;
  readonly uBy: string;
  readonly dTime: number;
  readonly dBy: string;
}
