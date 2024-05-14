import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const req = ctx.getRequest();

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const error = exception instanceof HttpException ? exception.name : "Internal server error";

    const responseBody: any = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      error: error,
    };
    if (exception instanceof HttpException) {
      const res: any = exception.getResponse();
      if (res) responseBody.message = res.message;
    }

    if (httpStatus == 500 || httpStatus == 400) {
      const meta = {
        url: req.url,
        query: req.query,
        body: req.body,
        user: req.user,
        stack: exception?.stack,
        exception: exception.name,
      };
      this.logger.error({ message: exception.toString(), meta });
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
