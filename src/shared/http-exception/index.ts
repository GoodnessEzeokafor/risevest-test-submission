import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, } from 'express';
import {
  ResponseStateEnum,
} from 'src/shared';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  ERROR_MESSAGE = 'An error occurred, please contact support';
  ERROR_MESSAGES = [
    'Session has expired, please login or restart reset password process.',
  ];
  ERROR_STATUSES = [404];

  errorMessage(error: any) {
    if (error.message) return error.message;
    if (error.responseMessage) return error.responseMessage; // external service
    return this.ERROR_MESSAGE;
  }

  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message as unknown as HttpException;

    console.log('======= error =====');
    console.log(exception);
    console.log('======= error =====');



    response.status(status).json({
      technicalMessage: message,
      message: this.#displayErrorMessage(exception),
      status,
      state: ResponseStateEnum.ERROR,
    });
  }

  #displayErrorMessage(exception: Error | HttpException) {
    const message = exception?.message as unknown as HttpException;
    const name = exception?.name
    if (this.ERROR_MESSAGES.includes(String(message))) {
      return message
    }
    if (name === 'BadRequestException') {
      return message
    }

    return 'An error has occurred, please contact support.'
  }
}
