import { Request as ExpressRequest } from 'express';

import { BaseResource } from '@definitions';
import { ServiceClass } from '@server/definitions';
import { ApiError, ErrorService } from '@server/resources/error';

export enum VALIDATION_ERRORS {
    NOT_PROVIDED = 'VALIDATION_ERROR_NOT_PROVIDED',
    NOT_FOUND = 'VALIDATION_ERROR_NOT_FOUND',
}

interface ValidationResult {
    errors: ApiError[];
    item: BaseResource | undefined;
    status: number;
}
/**
 *
 * @param key The key the api item will provide the param as.  example.com/*:item*\/14 would have
 *  the key 'item'
 * @param service The service that will be looked at.  the id and key will be used to lookup the
 *  param
 * @param req The raw express req.  req.params and req.body will be searched for the param value.
 */
export default function baseValidationMiddleware(
  key: string,
  service: ServiceClass,
  req: ExpressRequest,
): ValidationResult {
  const validation: ValidationResult = {
    errors: [],
    item: undefined,
    status: 500,
  };

  const identifier = req.params[key] || req.body[key];

  if (!identifier) {
    validation.errors.push(
      ErrorService.create(
        VALIDATION_ERRORS.NOT_PROVIDED,
        `The paramater ${key} is missing`,
      ),
    );
    validation.status = 400;
  } else {
    validation.item = service.get(identifier);

    if (!validation.item && 'getByKey' in service) {
      validation.item = service.getByKey(identifier);
    }

    if (!validation.item) {
      validation.errors.push(
        ErrorService.create(
          VALIDATION_ERRORS.NOT_FOUND,
          `The paramater ${key} with value [${identifier}] could not be used to find an item`,
        ),
      );
      validation.status = 404;
    }
  }

  return validation;
}
