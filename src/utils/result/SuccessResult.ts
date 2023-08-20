import {Result} from "./Result";

export class SuccessResult extends Result {
    constructor(message: string) {
        super(true, message);
    }
}
