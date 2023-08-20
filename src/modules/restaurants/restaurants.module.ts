import {Module} from '@nestjs/common';
import {RestaurantsController} from './restaurants.controller';
import {RestaurantsService} from './restaurants.service';
import {RestaurantSchema} from "./schemas/restaurant.schema";
import {MongooseModule} from "@nestjs/mongoose";
import {AuthModule} from "../auth/auth.module";


@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            {
                name: 'Restaurant',
                schema: RestaurantSchema,
                collection: 'restaurants'
            }
        ]),
    ],
    controllers: [RestaurantsController],
    providers: [RestaurantsService],
    exports: [MongooseModule]
})
export class RestaurantsModule {
}
