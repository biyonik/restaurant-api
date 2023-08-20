import {Result} from "./Result";

export class ErrorResult extends Result {
    constructor(message: string) {
        super(false, message);
    }
}
