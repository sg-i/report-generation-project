import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message = (typeof exceptionResponse === 'string') ? exceptionResponse : (exceptionResponse as any).message;

    response
      .status(status)
      .json({
        statusCode: status,
        message: message,
      });
  }
}
