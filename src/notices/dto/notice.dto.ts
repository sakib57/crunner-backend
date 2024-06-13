import { IsString, IsMongoId, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NoticeDTO implements Readonly<NoticeDTO> {
  @ApiProperty()
  @IsMongoId()
  category: string;

  @ApiProperty()
  @IsString()
  sl: string;

  @ApiProperty()
  @IsString()
  linkTitle: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsNumber()
  publishedDate: number;

  @ApiProperty()
  @IsString()
  file: string;

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
