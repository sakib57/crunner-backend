import { ApiProperty } from '@nestjs/swagger';
import {
  MaxLength,
  MinLength,
  Matches,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export class AuthDTO {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: '01311856963',
  })
  @MaxLength(11)
  @MinLength(11)
  @Matches(/^[1-9]\d*$/)
  @IsString()
  mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  readonly password: string;

  @IsBoolean()
  readonly isSuperAdmin: boolean;

  @IsString()
  readonly fcmToken: string;

  @IsBoolean()
  readonly isAdmin: boolean;
}
