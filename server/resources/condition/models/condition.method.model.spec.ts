import { Request as ExpressRequest } from 'express';

import { ConditionService, ConditionType } from '../../condition';

describe('MethodCondition', () => {
    describe('test', () => {
        let req: ExpressRequest;

        beforeEach(() => {
            req = {} as ExpressRequest;
        });

        it('returns true when the request method matches the condition method', () => {
            req.method = 'POST';
            const condition = ConditionService.create(ConditionType.Method, { method: 'POST' });

            expect(condition.test(req)).toBeTruthy();
        });

        it('returns true when the request method does not match the condition method', () => {
            req.method = 'POST';
            const condition = ConditionService.create(ConditionType.Method, { method: 'GET' });
            expect(condition.test(req)).toBeFalsy();
        });
    });
});
