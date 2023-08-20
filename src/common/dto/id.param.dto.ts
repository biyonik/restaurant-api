import {IsMongoId, IsNotEmpty, IsString} from "class-validator";

export class IdParamDto {
    @IsMongoId({
        message: 'Invalid ObjectId'
    })
    @IsString({
        message: 'ObjectId must be string'
    })
    @IsNotEmpty({
        message: 'ObjectId is required'
    })
    id: string;
}
