import { Domain, DomainDocument } from './domain.model';
import DomainService from './domain.service';
import TestDB from '@server/test.db';


describe('domain service', () => {
    let foo: DomainDocument;

    beforeAll(async () => await TestDB.connect());
    afterEach(async () => await TestDB.clearDatabase());
    afterAll(async () => await TestDB.closeDatabase());

    beforeEach(async () => {
        foo = await DomainService.create('foo', 'foo', 'foo');
    });

    describe('create', () => {

        it('returns the created item', async () => {
            expect(await DomainService.create('bar', 'bar', 'bar')).toBeInstanceOf(Domain);
        });

        it('Adds the created item to the items array', async () => {
            await DomainService.create('bar', 'bar', 'bar');
            await DomainService.create('baz', 'baz', 'baz');

            // Include the one in the beforeEach
            expect((await DomainService.getAll()).length).toBe(3);
        });

        it('throws an error if attempting to create an item with a duplicate key', async () => {
            expect.assertions(1);
            try {
                await DomainService.create('foo', 'foo', 'foo');
            } catch (e) {
                expect(e).toBeTruthy();
            }
        });
    });

    describe('getByIdentifier', () => {
        it('returns an item based on the key', async () => {
            const item = await DomainService.getByIdentifier('foo') as DomainDocument;
            expect(item.id).toEqual(foo.id);
        });

        it('returns undefined if the key does not exist', async () => {
            const item = await DomainService.getByIdentifier('bar')
            expect(item).toBeNull();
        });
    });
});
