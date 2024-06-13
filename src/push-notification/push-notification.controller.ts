import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PushNotificationDto } from './push-notification.dto';
import { PushNotificationService } from './push-notification.service';

@ApiTags('Push Notification')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('push-notification')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @Post('send')
  public send(@Body() pushNotificationDto: PushNotificationDto) {
    return this.pushNotificationService.send(pushNotificationDto);
  }
}
