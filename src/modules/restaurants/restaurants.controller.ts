import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query, Req, UploadedFiles, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {Query as ExpressQuery} from 'express-serve-static-core';
import {RestaurantsService} from "./restaurants.service";
import {Restaurant} from "./schemas/restaurant.schema";
import {CreateRestaurantDto} from "./dto/create-restaurant.dto";
import {UpdateRestaurantDto} from "./dto/update-restaurant.dto";
import {SuccessResult} from 'src/decorators/SuccessResult';
import {FilesInterceptor} from "@nestjs/platform-express";
import {ResultInterceptor} from "../../interceptors/result.interceptor";
import {FailResult} from "src/decorators/FailResult";
import {IDataResult} from "../../utils/result/abstract/IDataResult";
import {IdParamDto} from "../../common/dto/id.param.dto";
import {IResult} from "../../utils/result/abstract/IResult";
import {AuthGuard} from "../../guards/auth.guard";
import {CurrentUser} from "../../decorators/CurrentUser";
import {User} from "../auth/schemas/user.schema";
import {RoleGuard} from "../../guards/role.guard";
import {Roles} from "../../decorators/Roles";

@UseInterceptors(ResultInterceptor)
@Controller('restaurants')
export class RestaurantsController {
    constructor(
        private readonly restaurantsService: RestaurantsService,
    ) {}

    @Get()
    @UseGuards(AuthGuard, RoleGuard)
    @Roles('admin')
    @SuccessResult(HttpStatus.OK)
    @FailResult(HttpStatus.NOT_FOUND)
    async findAll(
        @Query() query: ExpressQuery,
        @CurrentUser() user: User
    ): Promise<IDataResult<Restaurant[] | null>> {
        return await this.restaurantsService.findAll(query);
    }

    @Get(':id')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles('admin')
    @SuccessResult(HttpStatus.OK)
    @FailResult(HttpStatus.NOT_FOUND)
    async findById(
        @Param()
            param: IdParamDto,
    ): Promise<IDataResult<Restaurant | null>> {
        return await this.restaurantsService.findById(param);
    }

    @Post()
    @UseGuards(AuthGuard, RoleGuard)
    @Roles('admin', 'user')
    @SuccessResult(HttpStatus.CREATED)
    @FailResult(HttpStatus.BAD_REQUEST)
    async add(
        @Body() restaurant: CreateRestaurantDto,
        @CurrentUser() user: User
    ): Promise<IResult> {
        return await this.restaurantsService.addRestaurant(restaurant, user);
    }

    @Put(':id')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles('admin')
    @SuccessResult(HttpStatus.OK)
    @FailResult(HttpStatus.BAD_REQUEST)
    async update(
        @Param() param: IdParamDto,
        @Body() restaurant: UpdateRestaurantDto,
        @CurrentUser() user: User
    ): Promise<IResult> {
        return await this.restaurantsService.updateRestaurant(param, restaurant, user);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles('admin')
    @SuccessResult(HttpStatus.OK)
    @FailResult(HttpStatus.BAD_REQUEST)
    async remove(
        @Param() param: IdParamDto,
    ): Promise<IResult> {
        return await this.restaurantsService.deleteRestaurant(param);
    }

    @Put('upload/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles('admin')
    @SuccessResult(HttpStatus.OK)
    @FailResult(HttpStatus.BAD_REQUEST)
    @UseInterceptors(FilesInterceptor('files'))
    async upload(
        @Param() param: IdParamDto,
        @UploadedFiles() files: Array<Express.Multer.File>
    ): Promise<IResult> {
        return await this.restaurantsService.uploadRestaurantImage(param, files);
    }

    @Delete('delete-image/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles('admin')
    @SuccessResult(HttpStatus.OK)
    @FailResult(HttpStatus.BAD_REQUEST)
    async deleteImage(
        @Param() param: IdParamDto,
        @Query() query: ExpressQuery
    ): Promise<IResult> {
        return await this.restaurantsService.deleteRestaurantImage(param, query);
    }
}
