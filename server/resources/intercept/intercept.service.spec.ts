import { Intercept, InterceptDocument } from './intercept.model';
import InterceptService from './intercept.service';
import TestDB from '@server/test.db';
import { DomainService } from '../domain';
import { Types } from 'mongoose';


describe('intercept service', () => {

    beforeAll(async () => await TestDB.connect());
    afterEach(async () => await TestDB.clearDatabase());
    afterAll(async () => await TestDB.closeDatabase());


    describe('create', () => {
        it('returns the created item', async () => {
            const bar = await InterceptService.create('bar')
            expect(bar).toBeInstanceOf(Intercept);
        });

        it('Saves the model in the database', async () => {
            const bar = await InterceptService.create('bar')
            const retrieved = await Intercept.findById(bar.id) as InterceptDocument

            expect(retrieved.id).toEqual(bar.id)
        });
    });

    describe('getAll', () => {
        it('returns no documents if db is empty', async () => {
            const items = await InterceptService.getAll();
            expect(items.length).toBe(0)
        })

        it('returns one document if db has one document', async () => {
            await InterceptService.create('foo')
            const items = await InterceptService.getAll();
            expect(items.length).toBe(1)
        })

        it('returns all documents if db has many documents', async () => {
            await InterceptService.create('foo')
            await InterceptService.create('bar')
            await InterceptService.create('baz')
            const items = await InterceptService.getAll();
            expect(items.length).toBe(3)
        })

        it('does not return documents that do not belong', async () => {
            await InterceptService.create('foo')
            await InterceptService.create('bar')
            await InterceptService.create('baz')
            await DomainService.create('red', 'herring', 'document')

            const items = await InterceptService.getAll();
            expect(items.length).toBe(3)
        })
    });

    describe('get', () => {
        it('returns no document if the document does not exist', async () => {
            const item = await InterceptService.get(new Types.ObjectId())
            expect(item).toBeNull();
        })

        it('returns the document if the document does exist', async () => {
            const item = await InterceptService.create('foo')
            const retrieved = await InterceptService.get(item.id) as InterceptDocument;

            expect(retrieved.id).toEqual(item.id)
        })
    });

    describe('remove', () => {
        it('removes the document from the db', async () => {
            const item = await InterceptService.create('foo')
            await InterceptService.remove(item.id);
            const retrieved = await InterceptService.get(item.id) as InterceptDocument;

            expect(retrieved).toBeNull();
        })

        it('does not fail if the document does not exist', async () => {
            expect(async () => {
                await InterceptService.remove(new Types.ObjectId());
            }).not.toThrow();
        })
    });

});
