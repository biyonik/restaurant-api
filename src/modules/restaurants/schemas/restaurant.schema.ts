import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';
import {Location} from "./location.schema";
import {User} from "../../auth/schemas/user.schema";
import * as mongoose from "mongoose";
import {Meal} from "../../meal/schemas/meal.schema";
export enum Category {
    ASIAN = 'Asian',
    EUROPEAN = 'European',
    AMERICAN = 'American',
    CHINESE = 'Chinese',
    JAPANESE = 'Japanese',
    KOREAN = 'Korean',
    TAIWAN = 'Taiwan',
    FAST_FOOD = 'Fast Food',
    LUNCH = 'Lunch',
    DINNER = 'Dinner',
    DRINK = 'Drink',
    SNACK = 'Snack',
    DRINKING = 'Drinking',
    CAFE = 'Cafe',
    FINE_DINING = 'Fine Dining',
}

@Schema({
    versionKey: false,
    timestamps: true
})
export class Restaurant {
    @Prop({
        required: true,
        type: String,
        minlength: 3,
        maxlength: 256
    })
    name: string;

    @Prop({
        type: String,
        maxlength: 1024
    })
    description: string;

    @Prop({
        type: String
    })
    email: string

    @Prop({
        type: String
    })
    phone: string

    @Prop({
        type: String
    })
    address: string

    @Prop()
    category: Category

    @Prop()
    images?: object[]

    @Prop({
        type: Object,
        ref: 'Location'
    })
    location?: Location

    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Meal'
        }
    ])
    menu?: Meal[]

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    user?: User
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
