import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IWrappedResponse } from '../interfaces/response.interface';
import { Response } from 'express';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, IWrappedResponse<T | null>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IWrappedResponse<T | null>> {
    const httpResponse = context.switchToHttp().getResponse<Response>();
    const statusCode = httpResponse.statusCode;

    return next.handle().pipe(
      map((res: unknown): IWrappedResponse<T | null> => {
        let data: T | null = null;
        let message: string | undefined;

        if (res === null || res === undefined) {
          data = null;
        } else if (typeof res === 'object' && res !== null && 'data' in res) {
          const r = res as { data?: T; message?: string };
          data = r.data ?? null;
          message = r.message;
        } else {
          data = res as T;
        }

        return {
          meta: {
            status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error',
            statusCode,
            message:
              message ??
              (statusCode >= 200 && statusCode < 300 ? 'OK' : 'Error'),
          },
          data,
        };
      }),
    );
  }
}
