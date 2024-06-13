import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDTO implements Readonly<UpdateCategoryDTO> {
  @ApiProperty()
  name: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isDeleted: boolean;
}
