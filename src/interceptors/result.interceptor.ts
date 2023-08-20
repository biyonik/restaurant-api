import {Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import {Reflector} from "@nestjs/core";

@Injectable()
export class ResultInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const successStatusCode = this.reflector.get<number>('success-result', context.getHandler());
        const failStatusCode = this.reflector.get<number>('fail-result', context.getHandler());

        return next.handle().pipe(
            map(result => {
                const response = context.switchToHttp().getResponse<Response>();
                const statusCode = result.success ? (successStatusCode || HttpStatus.OK) : (failStatusCode || HttpStatus.INTERNAL_SERVER_ERROR);
                response.status(statusCode);
                return result;
            })
        );
    }
}
