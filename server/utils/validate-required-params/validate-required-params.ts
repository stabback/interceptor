import { ApiError, ErrorService } from '@server/resources/error';
import { Response as ExpressResponse } from 'express';

export default (params: {}, errorCode = 'GENERAL_VALIDATION_ERROR', res?: ExpressResponse): ApiError[] => {
  const errors = Object.entries(params)
    .filter(([, value]) => value === undefined || value === '')
    .map(([key]) => ErrorService.create(errorCode, `The param ${key} must be provided`));

  if (res && errors.length > 0) {
    res.status(400);
    res.send(ErrorService.buildPayload(errors));
  }

  return errors;
};
