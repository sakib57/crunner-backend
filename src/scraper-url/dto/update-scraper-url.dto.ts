import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScraperUrlDTO implements Readonly<UpdateScraperUrlDTO> {
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
  timezone: string;
}
