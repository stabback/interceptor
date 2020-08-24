import { Intercept } from './intercept.model';
import InterceptService from './intercept.service';

function createItem(name = 'bar') {
    return InterceptService.create(
        name, ['condition1'], ['response1'],
    );
}

describe('intercept service', () => {
    let foo: Intercept;
    beforeEach(() => {
        InterceptService.items = [];
        foo = createItem('foo');
    });

    describe('create', () => {

        it('returns the created item', () => {
            expect(createItem()).toBeInstanceOf(Intercept);
        });

        it('Adds the created item to the items array', () => {
            createItem();
            createItem('baz');

            // Include the one in the beforeEach
            expect(InterceptService.items.length).toBe(3);
        });
    });
});
