import { Response as ExpressResponse } from 'express';

import { ResponseDocument } from './response.model';
import ResponseService from './response.service';
import TestDB from '@server/test.db';

describe('Response model', () => {
    let response: ResponseDocument;
    const res = {} as ExpressResponse;

    beforeAll(async () => await TestDB.connect());
    afterEach(async () => await TestDB.clearDatabase());
    afterAll(async () => await TestDB.closeDatabase());

    beforeEach(async () => {
        response = await ResponseService.create(
            'foo',
            undefined,
            [
                {
                    name: 'bar',
                    value: 'Bar'
                },
                {
                    name: 'foo',
                    value: 'Foo'
                }
            ],
            200,
            200);

        res.status = jest.fn();
        res.setHeader = jest.fn();
        res.send = jest.fn();

    });
    describe('send', () => {
        it('sets the status appropriately', () => {
            response.send(res);
            expect(res.status).toBeCalledWith(response.status);
        });

        it('sets every header', () => {
            response.send(res);
            expect(res.setHeader).toBeCalledTimes(Object.keys(response.headers).length);
        });

        it('sends an empty body if undefined', async (done) => {
            await response.send(res);
            expect(res.send).toHaveBeenCalledWith(undefined);
            done();
        });

        it('sends the body as is if a string', async (done) => {
            response.body = 'foo';
            await response.send(res);
            expect(res.send).toHaveBeenCalledWith('foo');
            done();
        });

        it('sends the body as a stringified json object otherwise', async (done) => {
            response.body = "{foo: 'bar'}";
            await response.send(res);
            expect(res.send).toHaveBeenCalledWith(
                response.body,
            );
            done();
        });
    });
});
