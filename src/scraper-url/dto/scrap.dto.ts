import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScrapDTO implements Readonly<ScrapDTO> {
  @ApiProperty({
    example: 'something.com',
  })
  @IsString()
  @IsNotEmpty()
  url: string;
}
