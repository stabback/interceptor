import { ServerErrorService } from '@server/resources/server-error';

import validateRequiredParams from './validate-required-params';

jest.mock('@server/resources/server-error', () => ({
    ServerErrorService: {
        buildPayload: jest.fn(),
        create: jest.fn(),
    },
}));

describe('validate-required-params util', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns an empty array if no params', async () => {
        const result = await validateRequiredParams({});
        expect(result.length).toBe(0);
    });

    it('returns an empty array if all params are provided', async () => {
        const result = await validateRequiredParams({
            bar: 'baz',
            foo: 'bar',
        });
        expect(result.length).toBe(0);
    });

    it('creates an error for every undefined param', async () => {
        await validateRequiredParams({
            bar: undefined,
            foo: undefined,
        });

        expect(ServerErrorService.create).toHaveBeenCalledTimes(2);
    });

    it('creates an error for every empty string param', async () => {
        await validateRequiredParams({
            bar: '',
            baz: '',
            foo: '',
        });

        expect(ServerErrorService.create).toHaveBeenCalledTimes(3);
    });

    it('returns every error in an array', async () => {
        const result = await validateRequiredParams({
            bar: '',
            baz: 'hello',
            foo: '',
        });

        expect(result.length).toBe(2);
    });

    it('automatically sends a response if res is provided', async () => {
        // const res = new Response();
        // jest.spyOn(res, "status");
        // jest.spyOn(res, "send");

        // const result = validateRequiredParams({
        //     bar: "",
        //     baz: "hello",
        //     foo: "",
        // }, "VALIDATION", res);

        // expect(ServerErrorService.buildPayload).toHaveBeenCalled();
        // expect(res.status).toBeCalledWith(400);
        // expect(res.send).toHaveBeenCalled();
    });
});
