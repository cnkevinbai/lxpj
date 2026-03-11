import { Injectable, ValidationPipe as BaseValidationPipe } from '@nestjs/common'

@Injectable()
export class ValidationPipe extends BaseValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: 400,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          field: error.property,
          messages: Object.values(error.constraints || {}),
        }))
        return {
          statusCode: 400,
          message: 'Validation failed',
          errors: messages,
        }
      },
    })
  }
}
