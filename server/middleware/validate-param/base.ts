import { Request as ExpressRequest } from 'express';

import { Service } from '@server/definitions';
import { ServerErrorService, ServerErrorDocument } from '@server/resources/server-error';
import { Document } from 'mongoose';

export enum VALIDATION_ERRORS {
    NOT_PROVIDED = 'VALIDATION_ERROR_NOT_PROVIDED',
    NOT_FOUND = 'VALIDATION_ERROR_NOT_FOUND',
}

interface ValidationResult {
    errors: ServerErrorDocument[];
    item: Document | undefined;
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
export default async function baseValidationMiddleware(
  key: string,
  service: {
    new(): Service;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get?(id: any): any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getByIdentifier?(identifier: string): any;
  },
  req: ExpressRequest,
): Promise<ValidationResult> {
  const validation: ValidationResult = {
    errors: [],
    item: undefined,
    status: 500,
  };

  const identifier = req.params[key] || req.body[key];

  if (!identifier) {
    validation.errors.push(
      await ServerErrorService.create(
        VALIDATION_ERRORS.NOT_PROVIDED,
        `The paramater ${key} is missing`,
      ),
    );
    validation.status = 400;
  } else {
    if ('get' in service && service.get) {
      validation.item = await service.get(identifier);
    }

    if (!validation.item && 'getByIdentifier' in service && service.getByIdentifier) {
      validation.item = await service.getByIdentifier(identifier);
    }

    if (!validation.item) {
      validation.errors.push(
        await ServerErrorService.create(
          VALIDATION_ERRORS.NOT_FOUND,
          `The paramater ${key} with value [${identifier}] could not be used to find an item`,
        ),
      );
      validation.status = 404;
    }
  }

  return validation;
}
