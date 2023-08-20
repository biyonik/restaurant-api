import {JwtService} from "@nestjs/jwt";

export default class AuthUtil {
    private static readonly bcrypt = require('bcryptjs');

    static async hashPassword(password: string): Promise<string> {
        const salt = await this.bcrypt.genSalt(10);
        return await this.bcrypt.hash(password, salt);
    }

    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await this.bcrypt.compare(password, hashedPassword);
    }

    static async generateToken(payload: any, jwtService: JwtService): Promise<string> {
        return new Promise((resolve, reject) => {
            jwtService.signAsync(payload).then(token => {
                resolve(token);
            }).catch(err => {
                reject(err);
            });
        });
    }

    static async verifyToken(token: string, jwtService: JwtService): Promise<any> {
        return new Promise((resolve, reject) => {
            jwtService.verifyAsync(token).then(decoded => {
                resolve(decoded);
            }).catch(err => {
                reject(err);
            });
        });
    }

    static async decodeToken(token: string, jwtService: JwtService): Promise<any> {
        return new Promise((resolve, reject) => {
            const decoded = jwtService.decode(token, {
                json: true,
            });
            if (decoded) {
                resolve(decoded);
            } else {
                reject('Invalid token');
            }
        });
    }
}
