import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import {
  LoggingInterceptor,
  TransformInterceptor,
} from './common/interceptors';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ScraperUrlModule } from './scraper-url/scraper-url.module';
import { UserFollowModule } from './user-follow/user-follow.module';
import { CategoryModule } from './category/category.module';
import { ScrapingModule } from './scraping/scraping.module';
import { NoticesModule } from './notices/notices.module';
import { PushNotificationModule } from './push-notification/push-notification.module';

const DB_CONNECTION = process.env.DB_CONNECTION;
Logger.log(`DB: ${DB_CONNECTION}`, 'Database');

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(DB_CONNECTION),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    ScraperUrlModule,
    UserFollowModule,
    CategoryModule,
    ScrapingModule,
    NoticesModule,
    PushNotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
