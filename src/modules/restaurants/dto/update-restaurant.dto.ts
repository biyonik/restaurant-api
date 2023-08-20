import {Category} from "../schemas/restaurant.schema";
import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength} from "class-validator";
import {User} from "../../auth/schemas/user.schema";

export class UpdateRestaurantDto {
    @IsString({
        message: 'Name must be string',
    })
    @MaxLength(50, {
        message: 'Name cannot be longer than 50 characters',
    })
    @MinLength(2, {
        message: 'Name cannot be shorter than 2 characters',
    })
    @IsOptional()
    readonly name: string;

    @MaxLength(200, {
        message: 'Description cannot be longer than 200 characters',
    })
    @IsOptional()
    readonly description: string;

    @IsString({
        message: 'Email must be string',
    })
    @IsEmail({}, {
        message: 'Email is not valid',
    })
    @IsOptional()
    readonly email: string;

    @IsString({
        message: 'Address must be string',
    })
    @MaxLength(200, {
        message: 'Address cannot be longer than 200 characters',
    })
    @IsOptional()
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
    @IsOptional()
    readonly phone: string;

    @IsEnum(Category, {
        message: 'Category is not valid',
    })
    @IsOptional()
    readonly category: Category;

    @IsNotEmpty({
        message: 'You can not provide user id',
    })
    readonly user: User;
}
