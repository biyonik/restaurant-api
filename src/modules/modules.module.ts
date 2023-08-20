import { Module } from '@nestjs/common';
import {RestaurantsModule} from "./restaurants/restaurants.module";
import {AuthModule} from "./auth/auth.module";
import { MealModule } from './meal/meal.module';

@Module({
    imports: [
        RestaurantsModule,
        AuthModule,
        MealModule
    ],
    exports: [
        RestaurantsModule,
        AuthModule
    ]
})
export class ModulesModule {}
