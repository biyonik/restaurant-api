import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Observable} from "rxjs";
import {ErrorResult} from "../utils/result/ErrorResult";
import {IResult} from "../utils/result/abstract/IResult";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Login first to access this resource')
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
                algorithms: ['HS512', 'RS512', 'ES512', 'PS512', 'HS256', 'RS256', 'ES256', 'PS256'],
                ignoreExpiration: false,
                ignoreNotBefore: false,
                issuer: process.env.JWT_ISSUER,
                audience: process.env.JWT_AUDIENCE,
            });

            request.user = payload;
        } catch (e) {
            throw new UnauthorizedException('Cannot verified token! Because token is invalid or expired. Error -> ' + e.message);
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers['authorization'].split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
