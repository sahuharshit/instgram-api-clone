import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpStatus } from "@nestjs/common";
import { map, Observable } from "rxjs";

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        return {
          data,
          message: data?.Message,
          statusCode: HttpStatus.OK,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
