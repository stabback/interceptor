import { Response as ExpressResponse } from 'express';

import { Response } from './response.model';

describe('Response model', () => {
    let response: Response;
    const res = {} as ExpressResponse;

    beforeEach(() => {
        response = new Response({
            name: 'foo',
            status: 200,
            headers: {
                bar: 'Bar',
                foo: 'Foo',
            },
            body: undefined,
            delay: 200,
        }, 'foo');

        res.status = jest.fn();
        res.setHeader = jest.fn();
        res.send = jest.fn();

    });
    describe('send', () => {
        it('sets the status appropriately', () => {
            response.send(res);
            expect(res.status).toBeCalledWith(response.data.status);
        });

        it('sets every header', () => {
            response.send(res);
            expect(res.setHeader).toBeCalledTimes(Object.keys(response.data.headers).length);
        });

        it('sends an empty body if undefined', async (done) => {
            await response.send(res);
            expect(res.send).toHaveBeenCalledWith(undefined);
            done();
        });

        it('sends the body as is if a string', async (done) => {
            response.data.body = 'foo';
            await response.send(res);
            expect(res.send).toHaveBeenCalledWith('foo');
            done();
        });

        it('sends the body as a stringified json object otherwise', async (done) => {
            response.data.body = {foo: 'bar'};
            await response.send(res);
            expect(res.send).toHaveBeenCalledWith(
                JSON.stringify(response.data.body),
            );
            done();
        });
    });
});
