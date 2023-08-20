import {Module} from '@nestjs/common';
import {MealController} from './meal.controller';
import {MealService} from './meal.service';
import {MongooseModule} from "@nestjs/mongoose";
import {MealSchema} from "./schemas/meal.schema";
import {AuthModule} from "../auth/auth.module";
import {RestaurantsModule} from "../restaurants/restaurants.module";

@Module({
    imports: [
        AuthModule,
        RestaurantsModule,
        MongooseModule.forFeature([
            {name: 'Meal', schema: MealSchema}
        ])
    ],
    controllers: [MealController],
    providers: [MealService],
})
export class MealModule {
}
