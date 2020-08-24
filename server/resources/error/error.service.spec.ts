import ErrorService from './error.service';

import { ApiError } from './error.model';

function createItem(name = 'bar') {
    return ErrorService.create(
        name, 'some message',
    );
}

describe('error service', () => {
    let foo: ApiError;
    beforeEach(() => {
        ErrorService.items = [];
        foo = createItem('foo');
    });

    describe('create', () => {

        it('returns the created item', () => {
            expect(createItem('bar')).toBeInstanceOf(ApiError);
        });

        it('Adds the created item to the items array', () => {
            createItem('bar');
            createItem('baz');

            // Include the one in the beforeEach
            expect(ErrorService.items.length).toBe(3);
        });
    });
});
