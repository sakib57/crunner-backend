import {
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO implements Readonly<CreateUserDTO> {
  @ApiProperty({
    example: 'john@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '8tJ!ACq7fXg6@#',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @MinLength(5)
  @Matches(/^[^\s]+(\s+[^\s]+)*$/)
  password: string;

  @ApiProperty({
    example: '01311856963',
  })
  @MaxLength(11)
  @MinLength(11)
  @Matches(/^[0-9]\d*$/)
  @IsString()
  mobile: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}
