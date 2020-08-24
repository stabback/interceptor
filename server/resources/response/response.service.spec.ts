import { Response } from './response.model';
import ResponseService from './response.service';

function createItem(name = 'bar') {
    return ResponseService.create(
        name, 200, {}, '', 100,
    );
}

describe('response service', () => {
    let foo: Response;
    beforeEach(() => {
        ResponseService.items = [];
        foo = createItem('foo');
    });

    describe('create', () => {

        it('returns the created item', () => {
            expect(createItem()).toBeInstanceOf(Response);
        });

        it('Adds the created item to the items array', () => {
            createItem();
            createItem('baz');

            // Include the one in the beforeEach
            expect(ResponseService.items.length).toBe(3);
        });
    });
});
