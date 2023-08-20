import {Category} from "../schemas/meal.schema";
import {Restaurant} from "../../restaurants/schemas/restaurant.schema";
import {User} from "../../auth/schemas/user.schema";
import {IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min} from "class-validator";

export class UpdateMealDto {
    @IsString()
    @IsOptional()
    @MaxLength(50, {
        message: 'Name is too long. Maximal length is $constraint1 characters, but actual is $value'
    })
    readonly name: string;

    @IsEmpty()
    @MaxLength(500, {
        message: 'Description cannot be longer than 500 characters',
    })
    @IsOptional()
    readonly description: string;

    @IsOptional()
    @Min(0, {
        message: 'Price must be greater than 0'
    })
    @IsNumber({}, {
        message: 'Price must be a number'
    })
    readonly price: number;

    @IsOptional()
    @IsEnum(Category, {
        message: `Category must be a valid enum value (${Object.values(Category)})`
    })
    readonly category: Category;

    @IsOptional()
    readonly restaurant: Restaurant;

    @IsOptional()
    @IsEmpty({
        message: 'User must not be specified'
    })
    readonly user: User;
}
