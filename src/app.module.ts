import {Module} from '@nestjs/common';
import {MongooseModule, MongooseModuleOptions} from '@nestjs/mongoose';
import {AppController} from './app.controller';
import {ConfigModule} from "@nestjs/config";
import {ModulesModule} from './modules/modules.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}`,
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGO_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as MongooseModuleOptions),
        ModulesModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
}
