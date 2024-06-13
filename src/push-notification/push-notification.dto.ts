import { ApiProperty } from '@nestjs/swagger';

export class PushNotificationDto implements Readonly<PushNotificationDto> {
  @ApiProperty()
  token: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  body: string;
}
