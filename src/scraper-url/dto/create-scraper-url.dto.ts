import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScraperUrlDTO implements Readonly<CreateScraperUrlDTO> {
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
  timezone: string;
}
