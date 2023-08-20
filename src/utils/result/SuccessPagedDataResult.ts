import {PagedDataResult} from "./PagedDataResult";

export class SuccessPagedDataResult<T> extends PagedDataResult<T> {
    constructor(data: T, message: string, total: number, page: number, limit: number) {
        super(data, true, message, total, page, limit);
        this.total = total;
        this.page = page;
        this.limit = limit;
    }
}
