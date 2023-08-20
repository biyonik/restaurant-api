import {
    registerDecorator,
    ValidationArguments, ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import mongoose from "mongoose";
import {User} from "../schemas/user.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Injectable} from "@nestjs/common";

@ValidatorConstraint({name: 'IsEmailAlreadyExists', async: true})
@Injectable()
export class IsEmailAlreadyExistsConstraint implements ValidatorConstraintInterface {
    constructor(
        @InjectModel(User.name) private readonly userModel: mongoose.Model<User>
    ) {}

    validate(email: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return this.userModel.findOne({email: email}).then(user => {
            return !user;
        });
    }
}

export function IsEmailAlreadyExists(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailAlreadyExistsConstraint,
        });
    };
}
