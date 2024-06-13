import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from './users.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';


@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema },
        ]),
        JwtModule.register({
            secret: process.env.SECRET_KEY_JWT,
            signOptions: {
                expiresIn: 24 * 60 * 60 * 1000, // 1 days,
            },
        }),
    ],
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule { }
