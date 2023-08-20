import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {User} from 'src/modules/auth/schemas/user.schema';
export const CurrentUser = createParamDecorator(
    (data, context: ExecutionContext): User => context.switchToHttp().getRequest().user
);
