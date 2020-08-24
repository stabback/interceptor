import { Request as ExpressRequest } from 'express';

import { UserService } from '@server/resources/user';
import baseValidationMiddleware, { VALIDATION_ERRORS } from './base';

describe('base validation middleware', () => {
    let req: ExpressRequest;

    beforeEach(() => {
        req = {} as ExpressRequest;

        req.params = {};
        req.body = {};

        UserService.items = [];
    });

    it('returns an error if the provided key has no value in the body or params', () => {
        const validation = baseValidationMiddleware('foo', UserService, req);
        expect(
            validation.errors.some((err) => err.data.code === VALIDATION_ERRORS.NOT_PROVIDED),
        ).toBeTruthy();
    });

    it('returns an error if the value for the key cannot be used to find an item', () => {
        req.params.foo = 'bar';
        const validation = baseValidationMiddleware('foo', UserService, req);
        expect(
            validation.errors.some((err) => err.data.code === VALIDATION_ERRORS.NOT_FOUND),
        ).toBeTruthy();
    });

    it('returns the item if it is found', () => {
        const item = UserService.create('bar');
        req.params.foo = 'bar';

        const validation = baseValidationMiddleware('foo', UserService, req);
        expect(validation.item).toEqual(item);
    });
});
