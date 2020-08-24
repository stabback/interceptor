import { User } from './user.model';
import UserService from './user.service';

describe('user service', () => {
    let foo: User;
    beforeEach(() => {
        UserService.items = [];
        foo = UserService.create('foo');
    });

    describe('create', () => {

        it('returns the created item', () => {
            expect(UserService.create('bar')).toBeInstanceOf(User);
        });

        it('Adds the created item to the items array', () => {
            UserService.create('bar');
            UserService.create('baz');

            // Include the one in the beforeEach
            expect(UserService.items.length).toBe(3);
        });

        it('throws an error if attempting to create an item with a duplicate key', () => {
            expect(() => {
                UserService.create('foo');
            }).toThrow();
        });
    });

    describe('getByKey', () => {
        it('returns an item based on the key', () => {
            expect(UserService.getByKey('foo')).toEqual(foo);
        });

        it('returns undefined if the key does not exist', () => {
            expect(UserService.getByKey('bar')).toBeUndefined();
        });
    });
});
