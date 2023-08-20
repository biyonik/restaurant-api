import {ArgumentMetadata, Injectable, PipeTransform} from "@nestjs/common";
import {ObjectId} from 'mongodb'
import {ErrorResult} from "../utils/result/ErrorResult";
import {IResult} from "../utils/result/abstract/IResult";

@Injectable()
export class ValidObjectId implements PipeTransform<string> {
    transform(value: string, metadata: ArgumentMetadata): IResult | string {
        if (ObjectId.isValid(value)) {
            if ((String)(new ObjectId(value)) === value)
                return value;
            return new ErrorResult('Invalid ObjectId')
        }
        return new ErrorResult('Invalid ObjectId')
    };
}
