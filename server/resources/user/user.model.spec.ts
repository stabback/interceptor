const mockedGet = (key: string) => {
    if (key !== 'baz') {
        return key;
    }

    return undefined;
};

jest.mock('@server/resources/intercept', () => ({
    InterceptService: {
        get: jest.fn().mockImplementation(mockedGet),
    },
}));

import { Intercept, InterceptService } from '@server/resources/intercept';
import { User } from './user.model';

describe('User model', () => {
    describe('Intercepts', () => {
        let user: User;

        beforeEach(() => {
            user = new User({
                key: 'foo',
                intercepts: {
                    bar: 'bar',
                    baz: 'baz',
                    foo: 'foo',
                },
            });
        });

        it('attempts to get an intercept for every key', () => {
            const _ = user.Intercepts;

            expect(InterceptService.get).toBeCalledTimes(3);
        });

        it('returns an Intercept for every valid intercept id', () => {
            expect(user.Intercepts.length).toBe(2);
        });
    });
});
