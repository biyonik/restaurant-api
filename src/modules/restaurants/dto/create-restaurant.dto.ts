import {Category} from "../schemas/restaurant.schema";
import {User} from "../../auth/schemas/user.schema";
import {IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString, Max, MaxLength, MinLength} from "class-validator";

export class CreateRestaurantDto {
    @IsNotEmpty({
        message: 'Name cannot be empty',
    })
    @IsString({
        message: 'Name must be string',
    })
    @MaxLength(50, {
        message: 'Name cannot be longer than 50 characters',
    })
    @MinLength(2, {
        message: 'Name cannot be shorter than 2 characters',
    })
    readonly name: string;

    @MaxLength(200, {
        message: 'Description cannot be longer than 200 characters',
    })
    readonly description: string;

    @IsNotEmpty({
        message: 'Email cannot be empty',
    })
    @IsString({
        message: 'Email must be string',
    })
    @IsEmail({}, {
        message: 'Email is not valid',
    })
    readonly email: string;

    @IsNotEmpty({
        message: 'Category cannot be empty',
    })
    @IsEnum(Category, {
        message: 'Category is not valid',
    })
    readonly category: Category;

    @IsString({
        message: 'Address must be string',
    })
    @MaxLength(200, {
        message: 'Address cannot be longer than 200 characters',
    })
    readonly address: string;

    @IsPhoneNumber('TR', {
        message: 'Phone number is not valid',
    })
    @MaxLength(10, {
        message: 'Phone number cannot be longer than 10 characters',
    })
    @MinLength(10, {
        message: 'Phone number cannot be shorter than 10 characters',
    })
    readonly phone: string;

    readonly user: User;
}
