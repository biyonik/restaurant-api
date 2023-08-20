import * as mongoose from "mongoose";
import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Query} from "express-serve-static-core";
import {Restaurant} from "./schemas/restaurant.schema";
import {ImageType} from "./types/image.type";
import { IDataResult } from "src/utils/result/abstract/IDataResult";
import { ErrorDataResult } from "src/utils/result/ErrorDataResult";
import {SuccessPagedDataResult} from "../../utils/result/SuccessPagedDataResult";
import {SuccessDataResult} from "../../utils/result/SuccessDataResult";
import {IdParamDto} from "../../common/dto/id.param.dto";
import {IResult} from "../../utils/result/abstract/IResult";
import RestaurantLocation from "../../utils/restaurantLocation.util";
import {SuccessResult} from "../../utils/result/SuccessResult";
import {ErrorResult} from "../../utils/result/ErrorResult";
import UploadFileUtil from "../../utils/uploadFile.util";
import {User} from "../auth/schemas/user.schema";

/**
 * @description Restaurants Service
 * @export RestaurantsService
 * @class RestaurantsService
 */
@Injectable()
export class RestaurantsService {
    constructor(
        @InjectModel(Restaurant.name)
        private readonly restaurantModel: mongoose.Model<Restaurant>,
    ) {}

    /**
     * @description Get all restaurants
     * @returns {Promise<Restaurant[]>}
     * @memberof RestaurantsService
     * @example
     * const restaurants = await this.restaurantsService.findAll();
     */
    async findAll(query: Query): Promise<IDataResult<Restaurant[] | null>> {
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
                const totalCount = await this.restaurantModel.countDocuments();
                const pagedRestaurants = await this.restaurantModel.find({...keyword}).skip(skip).limit(resPerPage);
                if (!pagedRestaurants || !pagedRestaurants.length) {
                    return new ErrorDataResult(null, 'Restaurants not found!');
                }
                return new SuccessPagedDataResult(pagedRestaurants, 'Restaurants found', totalCount, currentPage, resPerPage);
            } else {
                const restaurants = await this.restaurantModel.find({...keyword});
                if (!restaurants || !restaurants.length) {
                    return new ErrorDataResult(null, 'Restaurants not found!');
                }
                return new SuccessDataResult(restaurants, 'Restaurants found');
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * @description Get restaurant by id
     * @returns {Promise<Restaurant>}
     * @memberof RestaurantsService
     * @example
     * const restaurant = await this.restaurantsService.findById(id);
     * @param param
     */
    async findById(param: IdParamDto): Promise<IDataResult<Restaurant | null>> {
        try {
            const restaurant = await this.restaurantModel.findById(param.id);
            if (!restaurant) {
                return new ErrorDataResult(null, 'Restaurant not found!');
            }
            return new SuccessDataResult(restaurant, 'Restaurant found');
        } catch (error) {
            return new ErrorDataResult(null, `${error}`);
        }
    }

    /**
     * @description Add restaurant
     * @param {Restaurant} restaurant
     * @param user
     * @returns {Promise<IResult>}
     * @memberof RestaurantsService
     * @example
     * const result = await this.restaurantsService.addRestaurant(restaurant);
     */
    async addRestaurant(restaurant: Restaurant, user: User): Promise<IResult> {
        try {
            const location = await RestaurantLocation.getRestaurantLocation(restaurant.address);
            const data = Object.assign(restaurant, {location: location, user: user.id});
            const newRestaurant = new this.restaurantModel(data);
            await newRestaurant.save();
            return new SuccessResult('Restaurant added successfully!');
        } catch (error) {
            return new ErrorResult(`Restaurant added failed! Error: ${error}`);
        }
    }

    /**
     * @description Update restaurant
     * @param param
     * @param {Restaurant} restaurant
     * @param user
     * @returns {Promise<IResult>}
     * @memberof RestaurantsService
     * @example
     * const result = await this.restaurantsService.updateRestaurant(restaurant);
     * */
    async updateRestaurant(param: IdParamDto, restaurant: Restaurant, user: User): Promise<IResult> {
        try {
            const restaurantIsExists = await this.findById(param);
            if (!restaurantIsExists.success) {
                return new ErrorResult('Restaurant not found!');
            }

            if (restaurantIsExists.data.user !== user.id) {
                return new ErrorResult('You are not authorized to update this restaurant!');
            }

            await this.restaurantModel.findByIdAndUpdate(param.id, restaurant, {
                new: true,
                runValidators: true,
            });
            return new SuccessResult('Restaurant updated successfully!');
        } catch (error) {
            return new ErrorResult(`Restaurant updated failed! Error: ${error}`);
        }
    }

    /**
     * @description Delete restaurant
     * @returns {Promise<IResult>}
     * @memberof RestaurantsService
     * @example
     * const result = await this.restaurantsService.deleteRestaurant(id);
     * @param param
     * */
    async deleteRestaurant(param: IdParamDto): Promise<IResult> {
        try {
            const restaurantIsExists = await this.findById(param)
            if (!restaurantIsExists.success) {
                return new ErrorResult('Restaurant not found!');
            }
            await this.restaurantModel.findByIdAndDelete(param.id);
            return new SuccessResult('Restaurant deleted successfully!');
        } catch (error) {
            return new ErrorResult(`Restaurant deleted failed! Error: ${error}`);
        }
    }

    async uploadRestaurantImage(param: IdParamDto, images: Array<Express.Multer.File>): Promise<IResult> {
        try {
            const restaurantIsExists = await this.findById(param);
            if (!restaurantIsExists.success) {
                return new ErrorResult('Restaurant not found!');
            }

            const uploaded = await UploadFileUtil.uploadToS3(images);
            if (!uploaded) {
                return new ErrorResult('Restaurant image not uploaded!');
            }

            await this.restaurantModel.findByIdAndUpdate(param.id, {images: uploaded as Object[]}, {
                new: true,
                runValidators: true,
            });
            return new SuccessResult('Restaurant image uploaded successfully!');
        } catch (error) {
            return new ErrorResult(`Restaurant image uploaded failed! Error: ${error}`);
        }
    }

    async deleteRestaurantImage(param: IdParamDto, query: Query): Promise<IResult> {
        try {
            const restaurantIsExists = await this.findById(param);
            if (!restaurantIsExists.success) {
                return new ErrorResult('Restaurant not found!');
            }

            if (!query.image) {
                return new ErrorResult('Image name is required!');
            }

            const deleted = await UploadFileUtil.deleteFromS3(query.image as string);
            if (!deleted) {
                return new ErrorResult('Restaurant image not deleted!');
            }

            // delete image from restaurant
            await this.restaurantModel.findByIdAndUpdate(param, {images: restaurantIsExists.data.images.filter((image: ImageType) => image.key !== query.image)});

            return new SuccessResult('Restaurant image deleted successfully!');
        } catch (error) {
            return new ErrorResult(`Restaurant image deleted failed! Error: ${error}`);
        }
    }
}
