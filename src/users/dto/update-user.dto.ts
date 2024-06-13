import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDTO implements Readonly<UpdateUserDTO> {
  @ApiProperty({
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty()
  isMobileVerified: boolean;

  @ApiProperty({
    default: false,
  })
  isDeleted: boolean;

  @ApiProperty()
  timezone: string;
}
