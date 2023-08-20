import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {MealService} from "./meal.service";
import {SuccessResult} from "../../decorators/SuccessResult";
import {FailResult} from "../../decorators/FailResult";
import {IDataResult} from "../../utils/result/abstract/IDataResult";
import {Meal} from "./schemas/meal.schema";
import {IdParamDto} from "../../common/dto/id.param.dto";
import {CreateMealDto} from "./dto/create-meal.dto";
import {CurrentUser} from "../../decorators/CurrentUser";
import {IResult} from "../../utils/result/abstract/IResult";
import {User} from "../auth/schemas/user.schema";
import {Query as ExpressQuery} from "express-serve-static-core";
import {AuthGuard} from "../../guards/auth.guard";
import {UpdateMealDto} from "./dto/update-meal.dto";
@Controller('meal')
export class MealController {
    constructor(
        private mealService: MealService
    ) {}

    @Get()
    @SuccessResult(HttpStatus.OK)
    @FailResult(HttpStatus.NOT_FOUND)
    async findAll(
        @Query() query: ExpressQuery,
    ): Promise<IDataResult<Meal[]>> {
        return await this.mealService.findAll(query);
    }

    @Get(':id')
    @SuccessResult(HttpStatus.OK)
    @FailResult(HttpStatus.NOT_FOUND)
    async findOne(@Param() param: IdParamDto): Promise<IDataResult<Meal>> {
        return await this.mealService.findById(param);
    }

    @Get('restaurant/:id')
    @SuccessResult(HttpStatus.OK)
    @FailResult(HttpStatus.NOT_FOUND)
    async findByRestaurantId(@Param() param: IdParamDto): Promise<IDataResult<Meal[]>> {
        return await this.mealService.findByRestaurantId(param);
    }

    @Post()
    @UseGuards(AuthGuard)
    @SuccessResult(HttpStatus.CREATED)
    @FailResult(HttpStatus.BAD_REQUEST)
    async create(
        @Body() createMealDto: CreateMealDto,
        @CurrentUser() user: User
    ): Promise<IResult> {
        return await this.mealService.create(createMealDto, user);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    @SuccessResult(HttpStatus.OK)
    @FailResult(HttpStatus.BAD_REQUEST)
    async update(
        @Param() param: IdParamDto,
        @Body() updateMealDto: UpdateMealDto,
        @CurrentUser() user: User
    ): Promise<IResult> {
        return await this.mealService.update(param, updateMealDto, user);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @SuccessResult(HttpStatus.OK)
    @FailResult(HttpStatus.BAD_REQUEST)
    async delete(
        @Param() param: IdParamDto,
        @CurrentUser() user: User
    ): Promise<IResult> {
        return await this.mealService.removeMeal(param, user);
    }
}
