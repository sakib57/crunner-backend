import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDTO implements Readonly<CreateCategoryDTO> {
  @ApiProperty()
  name: string;
}
