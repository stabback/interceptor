import { Response, ResponseDocument } from './response.model';
import ResponseService from './response.service';
import TestDB from '@server/test.db';
import { DomainService } from '../domain';
import { Types } from 'mongoose';


describe('response service', () => {

    beforeAll(async () => await TestDB.connect());
    afterEach(async () => await TestDB.clearDatabase());
    afterAll(async () => await TestDB.closeDatabase());


    describe('create', () => {
        it('returns the created item', async () => {
            const bar = await ResponseService.create('bar', 'message');
            expect(bar).toBeInstanceOf(Response);
        });

        it('Saves the model in the database', async () => {
            const bar = await ResponseService.create('bar', 'message');
            const retrieved = await Response.findById(bar.id) as ResponseDocument

            expect(retrieved.id).toEqual(bar.id)
        });
    });

    describe('getAll', () => {
        it('returns no documents if db is empty', async () => {
            const items = await ResponseService.getAll();
            expect(items.length).toBe(0)
        })

        it('returns one document if db has one document', async () => {
            await ResponseService.create('foo', 'foo')
            const items = await ResponseService.getAll();
            expect(items.length).toBe(1)
        })

        it('returns all documents if db has many documents', async () => {
            await ResponseService.create('foo', 'foo')
            await ResponseService.create('bar', 'bar')
            await ResponseService.create('baz', 'baz')
            const items = await ResponseService.getAll();
            expect(items.length).toBe(3)
        })

        it('does not return documents that do not belong', async () => {
            await ResponseService.create('foo', 'foo')
            await ResponseService.create('bar', 'bar')
            await ResponseService.create('baz', 'baz')
            await DomainService.create('red', 'hearing', 'item')

            const items = await ResponseService.getAll();
            expect(items.length).toBe(3)
        })
    });

    describe('get', () => {
        it('returns no document if the document does not exist', async () => {
            const item = await ResponseService.get(new Types.ObjectId())
            expect(item).toBeNull();
        })

        it('returns the document if the document does exist', async () => {
            const item = await ResponseService.create('foo', 'foo')
            const retrieved = await ResponseService.get(item.id) as ResponseDocument;

            expect(retrieved.id).toEqual(item.id)
        })
    });

    describe('remove', () => {
        it('removes the document from the db', async () => {
            const item = await ResponseService.create('foo', 'foo')
            await ResponseService.remove(item.id);
            const retrieved = await ResponseService.get(item.id) as ResponseDocument;

            expect(retrieved).toBeNull();
        })

        it('does not fail if the document does not exist', async () => {
            expect(async () => {
                await ResponseService.remove(new Types.ObjectId());
            }).not.toThrow();
        })
    });

});
