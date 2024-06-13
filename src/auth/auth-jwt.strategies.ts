import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET_KEY_JWT,
        });
    }

    async validate(payload: any) {
        return {
            _id: payload._id,
            email: payload.email,
            mobile: payload.mobile,
            isAdmin: payload.isAdmin,
            isSuperAdmin: payload.isSuperAdmin,
        };
    }
}

