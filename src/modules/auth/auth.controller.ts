import {Body, Controller, HttpStatus, Post, UseInterceptors} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {SuccessResult} from "src/decorators/SuccessResult";
import {FailResult} from "src/decorators/FailResult";
import {SignupDto} from "./dto/signup.dto";
import {ResultInterceptor} from "../../interceptors/result.interceptor";
import {IResult} from "../../utils/result/abstract/IResult";
import {SigninDto} from "./dto/signin.dto";

@Controller('auth')
@UseInterceptors(ResultInterceptor)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    @SuccessResult(HttpStatus.CREATED)
    @FailResult(HttpStatus.BAD_REQUEST)
    async register(
        @Body() signUpDto: SignupDto,
    ): Promise<IResult> {
        return this.authService.signup(signUpDto);
    }

    @Post('login')
    @SuccessResult(HttpStatus.OK)
    @FailResult(HttpStatus.BAD_REQUEST)
    async login(
        @Body() signinDto: SigninDto,
    ): Promise<IResult> {
        return this.authService.login(signinDto);
    }
}
