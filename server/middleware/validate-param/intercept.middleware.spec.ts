import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';

jest.mock('@server/resources/domain', () => ({
    DomainService: {
        get: (id: string) => {
            if (id === 'error') {
                return undefined;
            }

            return {
                data: { intercepts: ['foo'] },
            };
        },
    },
}));

jest.mock('./base', () => (type: string, service: any, req: any) => {
    if (req.url === 'error') {
        return {
            errors: ['foo'],
            item: undefined,
            status: 400,
        };
    }

    if (req.url === 'critical-error') {
        return {
            errors: [],
            item: undefined,
            status: 500,
        };
    }

    return {
        errors: [],
        item: {
            id: req.url,
        },
        status: 500,
    };
});

import validateIntercept from './intercept.middleware';

describe('validate intercept middleware', () => {
    let req: ExpressRequest;
    let res: ExpressResponse;
    let next: NextFunction;

    beforeEach(() => {
        req = {} as ExpressRequest;
        req.params = {};
        req.body = {};

        res = {} as ExpressResponse;
        next = jest.fn() as NextFunction;

        res.status = jest.fn();
        res.send = jest.fn();
    });

    it('returns an error if the base validation errors', () => {
        req.url = 'error';

        validateIntercept(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('throws an error if the base validation succeeds, but there is no item', () => {
        req.url = 'critical-error';

        expect(() => {
            validateIntercept(req, res, next);
        }).toThrow();
    });

    it('calls the next function if there is no domain', () => {
        validateIntercept(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('throws an error if the domain is not found.  domain must be validated first.', () => {
        req.params.domain = 'error';
        expect(() => {
            validateIntercept(req, res, next);
        }).toThrow();

    });

    it('returns an error if the domain does not have this intercept', () => {
        req.params.domain = 'foo';
        req.url = 'bar';

        validateIntercept(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('calls the next function if there is a domain with this intercept', () => {
        req.params.domain = 'foo';
        req.url = 'foo';

        validateIntercept(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
