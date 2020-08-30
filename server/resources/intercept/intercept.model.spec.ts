const mockFail = jest.fn().mockReturnValue(false );
const mockSuccess = jest.fn().mockReturnValue(true);

import { Request as ExpressRequest } from 'express';

import TestDB from '@server/test.db';
import { InterceptDocument, InterceptService } from '.';
import { ConditionService, ConditionSchema, Condition } from '../condition';
import { ResponseService } from '../response';
import { Types } from 'mongoose';

describe('Intercept model', () => {
    let intercept: InterceptDocument;

    beforeAll(async () => await TestDB.connect());
    afterEach(async () => await TestDB.clearDatabase());
    afterAll(async () => await TestDB.closeDatabase());

    beforeEach(async () => {
        intercept = await InterceptService.create(
            'foo',
            [],
            []
        );
    });

    it('adds conditions', async () => {
        const condition = await ConditionService.create('method', {method: 'POST'})
        await intercept.addCondition(condition);
        expect(intercept.conditions.length).toBe(1);
    });

    it('adds responses', async () => {
        const response = await ResponseService.create('foo', 'bar')
        await intercept.addResponse(response);
        expect(intercept.responses.length).toBe(1);
    });

    describe('test', () => {
        const req = {} as ExpressRequest;

        beforeEach(() => {
            mockFail.mockClear();
            mockSuccess.mockClear();
        });

        it('returns false with no conditions', async () => {
            expect(await intercept.test(req)).toBeFalsy();
        });

        it('tests each condition', async () => {
            const mockTest = jest.fn().mockReturnValue(true)
            Condition.prototype.test = mockTest
            const condition1 = await ConditionService.create('method', { method: 'POST' })
            await intercept.addCondition(condition1);

            const condition2 = await ConditionService.create('method', { method: 'POST' })
            await intercept.addCondition(condition2);

            await intercept.test(req);
            expect(mockTest).toHaveBeenCalledTimes(2);
        });

        it('fails if any conditions are not found', async () => {
            intercept.conditions = [new Types.ObjectId()];

            expect(await intercept.test(req)).toBeFalsy();
        });

        it('fails if any conditions fail', async () => {
            const mockTest = jest.fn().mockReturnValue(false)
            Condition.prototype.test = mockTest
            const condition1 = await ConditionService.create('method', { method: 'POST' })
            await intercept.addCondition(condition1);

            const condition2 = await ConditionService.create('method', { method: 'POST' })
            await intercept.addCondition(condition2);


            expect(await intercept.test(req)).toBeFalsy();
        });

        it('succeeds if all conditions match', async () => {
            const mockTest = jest.fn().mockReturnValue(true)
            Condition.prototype.test = mockTest
            const condition1 = await ConditionService.create('method', { method: 'POST' })
            await intercept.addCondition(condition1);

            const condition2 = await ConditionService.create('method', { method: 'POST' })
            await intercept.addCondition(condition2);
            expect(await intercept.test(req)).toBeTruthy();
        });
    });
});
