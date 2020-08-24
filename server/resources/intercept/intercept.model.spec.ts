const mockFail = jest.fn().mockReturnValue(false );
const mockSuccess = jest.fn().mockReturnValue(true);

jest.mock('@server/resources/condition', () => ({
    ConditionService: {
        get: jest.fn().mockImplementation((id: string) => {
            if (id.includes('missing')) {
                return undefined;
            } else if (id.includes('fail')) {
                return { test: mockFail };
            }
            return { test: mockSuccess };
        }),
    },
}));

import { Request as ExpressRequest } from 'express';

import { Intercept } from './intercept.model';

describe('Intercept model', () => {
    let intercept: Intercept;

    beforeEach(() => {
        intercept = new Intercept({
            conditions: ['condition1', 'condition2'],
            defaultResponse: 'response2',
            locked: false ,
            name: 'foo',
            responses: ['response1', 'response2'],
        }, 'foo');
    });

    it('adds conditions', () => {
        intercept.addCondition('condition3');
        expect(intercept.data.conditions.length).toBe(3);
    });

    it('removes conditions', () => {
        intercept.removeCondition('condition1');
        expect(intercept.data.conditions.length).toBe(1);
    });

    it('adds responses', () => {
        intercept.addResponse('response3');
        expect(intercept.data.responses.length).toBe(3);
    });

    describe('removeResponse', () => {
        it('removes responses', () => {
            intercept.removeResponse('response1');
            expect(intercept.data.responses.length).toBe(1);
        });

        it('sets the default response to null if the response being removed is the default', () => {
            intercept.removeResponse('response2');
            expect(intercept.data.defaultResponse).toBe(null);
        });

        it('does not set the default response to null if the response being removed is not the default', () => {
            intercept.removeResponse('response1');
            expect(intercept.data.defaultResponse).toBe('response2');
        });
    });

    describe('test', () => {
        const req = {} as ExpressRequest;

        beforeEach(() => {
            mockFail.mockClear();
            mockSuccess.mockClear();
        });

        it('returns false with no conditions', () => {
            intercept.data.conditions = [];
            expect(intercept.test(req)).toBeFalsy();
        });

        it('tests each condition', () => {
            intercept.test(req);
            expect(
                mockFail.mock.calls.length +
                mockSuccess.mock.calls.length,
            ).toBe(2);
        });

        it('fails if any conditions are not found', () => {
            intercept.data.conditions = [
                'condition1',
                'missing2',
                'condition3',
            ];

            expect(intercept.test(req)).toBeFalsy();
        });

        it('fails if any conditions fail', () => {
            intercept.data.conditions = [
                'fail1',
                'condition2',
            ];

            expect(intercept.test(req)).toBeFalsy();
        });

        it('succeeds if all conditions match', () => {
            expect(intercept.test(req)).toBeTruthy();
        });
    });
});
