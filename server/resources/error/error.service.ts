import { BaseService } from '@server/resources/base';

import { ApiError } from './error.model';

export class ErrorServiceClass extends BaseService< ApiError > {
  constructor() {
    super(
      'error',
      ApiError,
    );
  }

  public create(code: string, message: string): ApiError {
    const error = new ApiError({
      code,
      message,
      timestamp: new Date().toISOString(),
    });

    this.items = [
      ...this.items,
      error,
    ];

    return error;
  }
}

const errorService = new ErrorServiceClass();

export default errorService;
