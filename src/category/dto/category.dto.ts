import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDTO implements Readonly<CategoryDTO> {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  cTime: number;

  @ApiProperty()
  cBy: string;

  @ApiProperty()
  uTime: number;

  @ApiProperty()
  uBy: string;

  @ApiProperty()
  dTime: number;

  @ApiProperty()
  dBy: string;

  @ApiProperty()
  timezone: string;
}
