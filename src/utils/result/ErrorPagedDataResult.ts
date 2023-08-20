import {PagedDataResult} from "./PagedDataResult";

export class ErrorPagedDataResult<T> extends PagedDataResult<T> {
    constructor(data: T, message: string, total: number, page: number, limit: number) {
        super(data, false, message, total, page, limit);
    }
}
