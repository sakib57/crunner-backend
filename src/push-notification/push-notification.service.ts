import { Injectable } from '@nestjs/common';
import * as fcmAdmin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from '../../push-notification-google-service.json';
import { PushNotificationDto } from './push-notification.dto';

@Injectable()
export class PushNotificationService {
  async send(pushNotificationDto: PushNotificationDto) {
    fcmAdmin.initializeApp({
      credential: fcmAdmin.credential.cert(serviceAccount as ServiceAccount), // Path to your service account JSON file
    });
    const { title, body, token } = pushNotificationDto;
    const payload = {
      notification: {
        title,
        body,
      },
    };

    Promise.all([await fcmAdmin.messaging().sendToDevice(token, payload)]);
  }
}
