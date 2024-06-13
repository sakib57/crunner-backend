import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserFollowDTO implements Readonly<CreateUserFollowDTO> {
  @ApiProperty()
  @IsMongoId()
  url: string;

  @ApiProperty()
  user: string;
}
