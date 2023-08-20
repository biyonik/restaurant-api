import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {MongooseModule} from "@nestjs/mongoose";
import {UserSchema} from "./schemas/user.schema";
import {IsEmailAlreadyExistsConstraint} from "./decorators/IsEmailAlreadyExists";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {JwtStrategy} from "./strategies/jwt.strategy";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema
            }
        ]),
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                verifyOptions: {
                    algorithms: ['HS512'],
                    audience: configService.get<string>('JWT_AUDIENCE'),
                    issuer: configService.get<string>('JWT_ISSUER'),
                    expiresIn: configService.get<string|number>('JWT_EXPIRATION_TIME'),
                },
                signOptions: {
                    expiresIn: configService.get<string|number>('JWT_EXPIRATION_TIME'),
                    audience: configService.get<string>('JWT_AUDIENCE'),
                    issuer: configService.get<string>('JWT_ISSUER'),
                    algorithm: 'HS512'
                },
            })
        })
    ],
    exports: [
        PassportModule,
        JwtModule,
        JwtStrategy
    ],
    controllers: [AuthController],
    providers: [AuthService, IsEmailAlreadyExistsConstraint, JwtStrategy]
})
export class AuthModule {
}
