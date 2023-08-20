export class Result {
    constructor(public success: boolean, public message: string) {
    }
  public static success(message: string): any {
    return {
      success: true,
      message,
    };
  }

  public static error(message: string): any {
    return {
      success: false,
      message,
    };
  }
}
