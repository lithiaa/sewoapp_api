import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { IWrappedError } from '../interfaces/error-response.interface';
import { HttpExceptionResponse } from '../types/http-exception-response.type';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse() as HttpExceptionResponse;
      message = errorResponse.message || exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: IWrappedError = {
      meta: {
        status: 'error',
        statusCode: status,
        message: Array.isArray(message) ? message.join(', ') : message,
      },
      data: null,
    };

    response.status(status).json(errorResponse);
  }
}
