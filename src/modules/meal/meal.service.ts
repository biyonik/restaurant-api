import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Meal} from "./schemas/meal.schema";
import * as mongoose from "mongoose";
import {IDataResult} from "../../utils/result/abstract/IDataResult";
import {Restaurant} from "../restaurants/schemas/restaurant.schema";
import {IdParamDto} from "../../common/dto/id.param.dto";
import {IResult} from "../../utils/result/abstract/IResult";
import {CreateMealDto} from "./dto/create-meal.dto";
import {User} from "../auth/schemas/user.schema";
import {ErrorResult} from "../../utils/result/ErrorResult";
import {SuccessResult} from "../../utils/result/SuccessResult";
import {ErrorDataResult} from "../../utils/result/ErrorDataResult";
import {SuccessDataResult} from "../../utils/result/SuccessDataResult";
import {Query} from "express-serve-static-core";
import {SuccessPagedDataResult} from "../../utils/result/SuccessPagedDataResult";
import {UpdateMealDto} from "./dto/update-meal.dto";

@Injectable()
export class MealService {
    constructor(
        @InjectModel(Meal.name) private mealModel: mongoose.Model<Meal>,
        @InjectModel(Restaurant.name) private restaurantModel: mongoose.Model<Restaurant>
    ) {}

    /**
     * Finds all meals
     * @param query
     * @returns {Promise<IDataResult<Meal[] | null>>}
     * @constructor
     * @param query
     */
    async findAll(query: Query): Promise<IDataResult<Meal[] | null>> {
        try {
            const keyword = query.keyword ? {
                name: {
                    $regex: query.keyword,
                    $options: 'i',
                }
            } : {};

            if (query.limit) {
                const resPerPage = query.limit ? Number(query.limit) : 10;
                const currentPage = query.page ? Number(query.page) : 1;
                const skip = (currentPage - 1) * resPerPage;
                const totalCount = await this.mealModel.countDocuments();
                const pagedMeals = await this.mealModel.find({...keyword}).populate([
                    {
                        path: 'restaurant',
                        select: 'name',
                    },
                    {
                        path: 'user',
                        select: 'name',
                    }
                ]).skip(skip).limit(resPerPage);
                if (!pagedMeals || !pagedMeals.length) {
                    return new ErrorDataResult(null, 'Meals not found!');
                }
                return new SuccessPagedDataResult(pagedMeals, 'Meals were found successfully', totalCount, currentPage, resPerPage);
            } else {
                const meals = await this.mealModel.find({...keyword}).populate([
                    {
                        path: 'restaurant',
                        select: ['name', 'description', 'phone'],
                    },
                    {
                        path: 'user',
                        select: ['name', 'email'],
                    }
                ]);
                if (!meals || !meals.length) {
                    return new ErrorDataResult(null, 'Meals not found!');
                }
                return new SuccessDataResult(meals, "Meals were found successfully!");
            }


        } catch (error) {
            throw new BadRequestException("Meals could not be found! Error -> " + error.message)
        }
    }

    /**
     * Finds meal by id
     * @param param
     * @returns {Promise<IDataResult<Meal | null>>}
     * @constructor
     */
    async findById(param: IdParamDto): Promise<IDataResult<Meal>> {
        try {
            const meal = await this.mealModel.findById(param.id).populate([
                {
                    path: 'restaurant',
                    select: ['name', 'description', 'phone'],
                },
                {
                    path: 'user',
                    select: ['name', 'email'],
                }
            ]);
            if (!meal) {
                return new ErrorDataResult(null,"Meal not found!");
            }
            return new SuccessDataResult(meal, "Meal was found successfully!");
        } catch (error) {
            throw new BadRequestException("Meal could not be found! Error -> " + error.message);
        }
    }

    /**
     * Finds meal by restaurant id
     * @param param
     * @returns {Promise<IDataResult<Meal[] | null>>}
     * @constructor
     */
    async findByRestaurantId(param: IdParamDto): Promise<IDataResult<Meal[]>> {
        try {
            const meal = await this.mealModel.find({restaurant: param.id}).populate([
                {
                    path: 'restaurant',
                    select: ['name', 'description', 'phone'],
                },
                {
                    path: 'user',
                    select: ['name', 'email'],
                }
            ]);
            if (!meal || meal.length === 0) {
                return new ErrorDataResult(null,"Meals not found!");
            }
            return new SuccessDataResult(meal, "Meals were found successfully!");
        } catch (error) {
            throw new BadRequestException("Meals could not be found! Error -> " + error.message);
        }
    }

    /**
     * Creates a new meal
     * @param createMealDto
     * @param user
     * @returns {Promise<IResult>}
     * @constructor
     */
    async create(createMealDto: CreateMealDto, user: User): Promise<IResult> {
        try {
            const data = Object.assign(createMealDto, {
                user: user.id
            });
            const createdMeal = await this.mealModel.create(data);

            // Saving meal id to restaurant
            const restaurant = await this.restaurantModel.findById(createMealDto.restaurant);

            if (!restaurant) {
                return new ErrorResult("Restaurant not found! But meal was created successfully!");
            }

            // Check ownership of the restaurant
            if (restaurant.user.toString() !== user.id.toString()) {
                return new ErrorResult("You can not add meal to this restaurant!");
            }


            restaurant.menu.push(createdMeal);
            await restaurant.save();
            return new SuccessResult("Meal was created successfully!");
        } catch (error) {
            throw new BadRequestException("Meal could not be created! Error -> " + error.message);
        }
    }

    /**
     * Updates meal
     * @param param
     * @param updateMealDto
     * @param user
     * @returns {Promise<IResult>}
     * @constructor
     */
    async update(param: IdParamDto, updateMealDto: UpdateMealDto, user: User): Promise<IResult> {
        try {
            const meal = await this.mealModel.findById(param.id);
            if (!meal) {
                return new ErrorResult("Meal not found!");
            }
            if (meal.user.toString() !== user.id.toString()) {
                return new ErrorResult("You can not update this meal!");
            }
            const updatedMeal = await this.mealModel.findByIdAndUpdate(param.id, updateMealDto, {new: true, runValidators: true});
            return new SuccessResult("Meal was updated successfully!");
        } catch (error) {
            throw new BadRequestException("Meal could not be updated! Error -> " + error.message);
        }
    }

    /**
     * Removes meal
     * @param param
     * @param user
     * @returns {Promise<IResult>}
     * @constructor
     */
    async removeMeal(param: IdParamDto, user: User): Promise<IResult> {
        try {
            const meal = await this.mealModel.findById(param.id);
            if (!meal) {
                return new ErrorResult("Meal not found!");
            }
            if (meal.user.toString() !== user.id.toString()) {
                return new ErrorResult("You can not delete this meal!");
            }
            await this.mealModel.findByIdAndDelete(param.id);
            // Deleting meal id from restaurant
            const restaurant = await this.restaurantModel.findById(meal.restaurant);
            if (!restaurant) {
                return new ErrorResult("Restaurant not found! But meal was deleted successfully!");
            }
            restaurant.menu = restaurant.menu.filter((item) => item.toString() !== param.id.toString());
            await restaurant.save();
            return new SuccessResult("Meal was deleted successfully!");
        } catch (error) {
            throw new BadRequestException("Meal could not be deleted! Error -> " + error.message);
        }
    }
}
