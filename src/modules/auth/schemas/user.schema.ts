import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export enum Roles {
    ADMIN = 'admin',
    USER = 'user'
}

@Schema()
export class User extends mongoose.Document {
    @Prop({
        required: true,
    })
    name: string;

    @Prop({
        required: true,
        unique: true,
    })
    email: string;

    @Prop({
        required: true,
        select: false,
    })
    password: string;

    @Prop({
        enum: Roles,
        default: Roles.USER,
    })
    role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
