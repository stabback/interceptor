import { Request as ExpressRequest } from 'express';

import { ConditionService } from '../../condition';
import { ConditionType } from '../condition.service';

describe('UrlCondition', () => {
    describe('test', () => {
        let req: ExpressRequest;

        beforeEach(() => {
            req = {} as ExpressRequest;

            req.url = 'https://example.com/foo/bar';
        });

        it('returns true when the request url matches the condition regex', () => {
            const condition = ConditionService.create(ConditionType.Url, { pattern: '\/foo\/bar' });
            expect(condition.test(req)).toBeTruthy();
        });

        it('returns true when the request url does not match the condition regex', () => {
            req.method = 'POST';
            const condition = ConditionService.create(ConditionType.Url, { pattern: '\/bar\/foo' });
            expect(condition.test(req)).toBeFalsy();
        });
    });
});
