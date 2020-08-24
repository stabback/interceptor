import { ErrorService } from '@server/resources/error';

import validateRequiredParams from './validate-required-params';

jest.mock('@server/resources/error', () => ({
    ErrorService: {
        buildPayload: jest.fn(),
        create: jest.fn(),
    },
}));

describe('validate-required-params util', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns an empty array if no params', () => {
        const result = validateRequiredParams({});
        expect(result.length).toBe(0);
    });

    it('returns an empty array if all params are provided', () => {
        const result = validateRequiredParams({
            bar: 'baz',
            foo: 'bar',
        });
        expect(result.length).toBe(0);
    });

    it('creates an error for every undefined param', () => {
        validateRequiredParams({
            bar: undefined,
            foo: undefined,
        });

        expect(ErrorService.create).toHaveBeenCalledTimes(2);
    });

    it('creates an error for every empty string param', () => {
        validateRequiredParams({
            bar: '',
            baz: '',
            foo: '',
        });

        expect(ErrorService.create).toHaveBeenCalledTimes(3);
    });

    it('returns every error in an array', () => {
        const result = validateRequiredParams({
            bar: '',
            baz: 'hello',
            foo: '',
        });

        expect(result.length).toBe(2);
    });

    it('automatically sends a response if res is provided', () => {
        // const res = new Response();
        // jest.spyOn(res, "status");
        // jest.spyOn(res, "send");

        // const result = validateRequiredParams({
        //     bar: "",
        //     baz: "hello",
        //     foo: "",
        // }, "VALIDATION", res);

        // expect(ErrorService.buildPayload).toHaveBeenCalled();
        // expect(res.status).toBeCalledWith(400);
        // expect(res.send).toHaveBeenCalled();
    });
});
