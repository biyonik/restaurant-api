import {HttpStatus, SetMetadata} from "@nestjs/common";

export const FailResult = (statusCode = HttpStatus.INTERNAL_SERVER_ERROR): any =>
    SetMetadata('fail-result', statusCode);
