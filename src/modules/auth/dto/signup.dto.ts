import {IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength} from "class-validator";
import {IsEmailAlreadyExists} from "../decorators/IsEmailAlreadyExists";

export class SignupDto {
    @IsString()
    @IsNotEmpty({message: 'Name is required'})
    @MinLength(2, {message: 'Name must be at least 2 characters'})
    @MaxLength(64, {message: 'Name must be at most 64 characters'})
    name: string;

    @IsString()
    @IsEmail({}, {message: 'Invalid email'})
    @IsNotEmpty({message: 'Email is required'})
    @IsEmailAlreadyExists({message: 'Email already exists'})
    email: string;

    @IsString()
    @IsNotEmpty({message: 'Password is required'})
    @MinLength(8, {message: 'Password must be at least 8 characters'})
    @MaxLength(20, {message: 'Password must be at most 20 characters'})
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minSymbols: 1,
        minLowercase: 1,
        minUppercase: 1,
    }, {
        message: 'Password is too weak',
    })
    password: string;

}
