import generateId from './generate-id';

describe('generateId util', () => {
    const params = ['foo', 'bar', 'baz'];

    it('includes all passed params in the resulting id', () => {
        const result = generateId(...params);

        expect(
            params.every((param) => result.includes(param)),
        ).toBeTruthy();
    });

    it('does not generate the same ID twice', () => {
        expect(generateId(...params)).not.toEqual(generateId(...params));
    });
});
