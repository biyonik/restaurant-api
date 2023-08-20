import {Result} from "./Result";

export class DataResult<T> {
  public data: T;

  constructor(data: T, public success: boolean, public message: string) {
    this.data = data;
  }

    public static success<T>(message: string, data: T): any {
      return {
        success: true,
        message,
        data,
      };
    }

    public static error<T>(message: string, data: T): any {
      return {
        success: false,
        message,
        data,
      };
    }
}
