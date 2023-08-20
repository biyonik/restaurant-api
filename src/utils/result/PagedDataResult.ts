import {DataResult} from "./DataResult";

export class PagedDataResult<T> extends DataResult<T> {
    data: T;
    message: string;
    success: boolean;
    total: number;
    page: number;
    limit: number;

    constructor(data: T, success:boolean, message: string, total: number, page: number, limit: number) {
        super(
            data,
            success,
            message
        );
        this.data = data;
        this.message = message;
        this.total = total;
        this.page = page;
        this.limit = limit;
    }
}
