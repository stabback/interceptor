import { Domain } from './domain.model';
import DomainService from './domain.service';

function createItem(name = 'bar') {
    return DomainService.create(
        name, 'url', name,
    );
}

describe('domain service', () => {
    let foo: Domain;
    beforeEach(() => {
        DomainService.items = [];
        foo = createItem('foo');
    });

    describe('create', () => {

        it('returns the created item', () => {
            expect(createItem('bar')).toBeInstanceOf(Domain);
        });

        it('Adds the created item to the items array', () => {
            createItem('bar');
            createItem('baz');

            // Include the one in the beforeEach
            expect(DomainService.items.length).toBe(3);
        });

        it('throws an error if attempting to create an item with a duplicate key', () => {
            expect(() => {
                createItem('foo');
            }).toThrow();
        });
    });

    describe('getByKey', () => {
        it('returns an item based on the key', () => {
            expect(DomainService.getByKey('foo')).toEqual(foo);
        });

        it('returns undefined if the key does not exist', () => {
            expect(DomainService.getByKey('bar')).toBeUndefined();
        });
    });
});
