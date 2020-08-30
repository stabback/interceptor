import { ServerErrorService, ServerErrorDocument } from '@server/resources/server-error';
import { Response as ExpressResponse } from 'express';

export default async (params: {}, errorCode = 'GENERAL_VALIDATION_ERROR', res?: ExpressResponse): Promise<ServerErrorDocument[]> => {
  const errors = await Promise.all(Object.entries(params)
    .filter(([, value]) => value === undefined || value === '')
    .map(([key]) => ServerErrorService.create(errorCode, `The param ${key} must be provided`)));

  if (res && errors.length > 0) {
    res.status(400);
    res.send(errors);
  }

  return errors;
};
