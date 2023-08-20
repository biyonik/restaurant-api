import {HttpStatus, SetMetadata} from "@nestjs/common";

export const SuccessResult = (statusCode = HttpStatus.OK): any =>
    SetMetadata('success-result', statusCode);
