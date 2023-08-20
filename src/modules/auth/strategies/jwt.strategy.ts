import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {InjectModel} from "@nestjs/mongoose";
import {User} from "../schemas/user.schema";
import mongoose from "mongoose";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(User.name) private userModel: mongoose.Model<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE,
            secretOrKey: process.env.JWT_SECRET,
            algorithms: ['HS512', 'RS512', 'ES512', 'PS512', 'HS256', 'RS256', 'ES256', 'PS256'],
            jsonWebTokenOptions: {
                secretOrKey: process.env.JWT_SECRET,
                algorithms: ['HS512', 'RS512', 'ES512', 'PS512', 'HS256', 'RS256', 'ES256', 'PS256'],
                expiresIn: process.env.JWT_EXPIRATION_TIME,
                audience: process.env.JWT_AUDIENCE,
                issuer: process.env.JWT_ISSUER,
                ignoreNotBefore: true,
            },
        });
    }

    async validate(payload: any) {
        const {id} = payload;
        const user = await this.userModel.findById(id);
        if (!user) {
            // return new ErrorDataResult(null, 'Login first to access this resource');
            throw new UnauthorizedException('Login first to access this resource');
        }
        // return new SuccessDataResult(user, 'User authenticated');
        return user;
    }
}
