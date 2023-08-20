import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import {Restaurant} from "../../restaurants/schemas/restaurant.schema";
import {User} from "../../auth/schemas/user.schema";

export enum Category {
    SOUPS = 'Soups',
    SALADS = 'Salads',
    SANDWICHES = 'Sandwiches',
    PIZZA = 'Pizza',
    PASTA = 'Pasta',
    CHICKEN = 'Chicken',
}

@Schema({
    versionKey: false,
    timestamps: true
})
export class Meal {
    @Prop({
        required: true
    })
    name: string;

    @Prop({
        default: '',
        required: false,
        maxlength: 500
    })
    description: string;

    @Prop({
        required: true,
        default: 0
    })
    price: number;

    @Prop({
        required: true,
        enum: Category,
    })
    category: Category;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    })
    restaurant: Restaurant;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    user: User;
}


export const MealSchema = SchemaFactory.createForClass(Meal);
