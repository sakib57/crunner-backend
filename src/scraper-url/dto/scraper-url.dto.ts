import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScraperUrlDTO implements Readonly<ScraperUrlDTO> {
  @ApiProperty()
  @IsMongoId()
  category: string;

  @ApiProperty({
    example: 'something.com',
  })
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: 'title',
  })
  @IsString()
  title: string;

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
