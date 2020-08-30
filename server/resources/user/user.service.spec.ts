import { User, UserDocument } from './user.model';
import UserService from './user.service';
import TestDB from '@server/test.db';
import { DomainService } from '../domain';
import { Types } from 'mongoose';


describe('user service', () => {

    beforeAll(async () => await TestDB.connect());
    afterEach(async () => await TestDB.clearDatabase());
    afterAll(async () => await TestDB.closeDatabase());


    describe('create', () => {
        it('returns the created item', async () => {
            const bar = await UserService.create('bar');
            expect(bar).toBeInstanceOf(User);
        });

        it('Saves the model in the database', async () => {
            const bar = await UserService.create('bar');
            const retrieved = await User.findById(bar.id) as UserDocument

            expect(retrieved.id).toEqual(bar.id)
        });
    });

    describe('getAll', () => {
        it('returns no documents if db is empty', async () => {
            const items = await UserService.getAll();
            expect(items.length).toBe(0)
        })

        it('returns one document if db has one document', async () => {
            await UserService.create('foo')
            const items = await UserService.getAll();
            expect(items.length).toBe(1)
        })

        it('returns all documents if db has many documents', async () => {
            await UserService.create('foo')
            await UserService.create('bar')
            await UserService.create('baz')
            const items = await UserService.getAll();
            expect(items.length).toBe(3)
        })

        it('does not return documents that do not belong', async () => {
            await UserService.create('foo')
            await UserService.create('bar')
            await UserService.create('baz')
            await DomainService.create('red', 'hearing', 'item')

            const items = await UserService.getAll();
            expect(items.length).toBe(3)
        })
    });

    describe('get', () => {
        it('returns no document if the document does not exist', async () => {
            const item = await UserService.get(new Types.ObjectId())
            expect(item).toBeNull();
        })

        it('returns the document if the document does exist', async () => {
            const item = await UserService.create('foo')
            const retrieved = await UserService.get(item.id) as UserDocument;

            expect(retrieved.id).toEqual(item.id)
        })
    });

    describe('removeByIdentifier', () => {
        it('removes the document from the db', async () => {
            const item = await UserService.create('foo')
            await UserService.removeByIdentifier(item.id);
            const retrieved = await UserService.get(item.id) as UserDocument;

            expect(retrieved).toBeNull();
        })

        it('does not fail if the document does not exist', async () => {
            expect(async () => {
                await UserService.removeByIdentifier('foobar');
            }).not.toThrow();
        })
    });

});
