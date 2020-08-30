import { Request as ExpressRequest } from 'express';

import { UserService } from '@server/resources/user';
import baseValidationMiddleware, { VALIDATION_ERRORS } from './base';
import TestDB from '@server/test.db';

describe('base validation middleware', () => {
    let req: ExpressRequest;

    beforeAll(async () => await TestDB.connect());
    afterEach(async () => await TestDB.clearDatabase());
    afterAll(async () => await TestDB.closeDatabase());

    beforeEach(() => {
        req = {} as ExpressRequest;

        req.params = {};
        req.body = {};
    });

    it('returns an error if the provided key has no value in the body or params', async () => {
        const validation = await baseValidationMiddleware('foo', UserService, req);
        expect(
            validation.errors.some((err) => err.code === VALIDATION_ERRORS.NOT_PROVIDED),
        ).toBeTruthy();
    });

    it('returns an error if the value for the key cannot be used to find an item', async () => {
        req.params.foo = 'bar';
        const validation = await baseValidationMiddleware('foo', UserService, req);
        expect(
            validation.errors.some((err) => err.code === VALIDATION_ERRORS.NOT_FOUND),
        ).toBeTruthy();
    });

    it('returns the item if it is found', async () => {
        const item = await UserService.create('bar');
        req.params.foo = 'bar';

        const validation = await baseValidationMiddleware('foo', UserService, req);
        expect(validation.item?.id).toEqual(item.id);
    });
});
