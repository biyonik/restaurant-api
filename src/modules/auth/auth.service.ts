import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User} from "./schemas/user.schema";
import * as mongoose from "mongoose";
import {IResult} from "src/utils/result/abstract/IResult";
import {SignupDto} from "./dto/signup.dto";
import {ErrorResult} from "src/utils/result/ErrorResult";
import {SuccessResult} from "src/utils/result/SuccessResult";
import AuthUtil from "src/utils/auth/auth.util";
import {IDataResult} from "../../utils/result/abstract/IDataResult";
import {LoginResult} from "./results/login.result";
import {ErrorDataResult} from "../../utils/result/ErrorDataResult";
import {SuccessDataResult} from "../../utils/result/SuccessDataResult";
import {SigninDto} from "./dto/signin.dto";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: mongoose.Model<User>,
        private readonly jwtService: JwtService
    ) {}

    /**
     * Creates a new user
     * @param signUpDto
     * @returns {Promise<IResult>}
     * @constructor
     * @public
     * @async
     * @summary Creates a new user
     * @description Creates a new user
     * @example
     * const result = await this.authService.signup(signUpDto);
     *
     */
    async signup(signUpDto: SignupDto): Promise<IResult> {
        try {
            const {name, email, password} = signUpDto;
            const hashedPassword = await AuthUtil.hashPassword(password);
            const user = new this.userModel({
                name,
                email,
                password: hashedPassword,
            });

            await user.save();
            return new SuccessResult('User created successfully');
        } catch (e) {
            return new ErrorResult('Error while creating user. Error message: ' + e.message);
        }
    }

    /**
     * Logs in a user
     * @param signinDto
     * @returns {Promise<IDataResult<LoginResult>>}
     * @constructor
     * @public
     * @async
     * @summary Logs in a user
     * @description Logs in a user
     * @example
     * const result = await this.authService.login(signinDto);
     */
    async login(signinDto: SigninDto): Promise<IDataResult<LoginResult>> {
        try {
            const {email, password} = signinDto;
            const user = await this.userModel.findOne({email}).select('+password');
            if (!user) {
                return new ErrorDataResult(null, 'User not found');
            }
            const isPasswordValid = await AuthUtil.comparePassword(password, user.password);
            if (!isPasswordValid) {
                return new ErrorDataResult(null, 'Invalid credentials!');
            }

            const token = await AuthUtil.generateToken({
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            }, this.jwtService);

            const loginResult: LoginResult = {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            };

            return new SuccessDataResult(loginResult, 'User logged in successfully');
        } catch (e) {
            return new ErrorDataResult(null, 'Error while logging in. Error message: ' + e.message);
        }
    }
}
