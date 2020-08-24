import { MultipleItemResponse } from '@definitions';
import kfs from 'key-file-storage';

import { KeyFileStorage } from 'key-file-storage/dist/src/key-file-storage';
import { BaseModel } from './model';

// Generic - unsure how to type this better
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class <ModelType extends BaseModel<any>> {
    public _items: ModelType[] = [];

    public store: KeyFileStorage;

    constructor(
      private type: string,

      // Constructor destructuring
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      private Model: new(...args: any[]) => ModelType,
    ) {
      this.store = kfs(`store/${this.type}`);
    }

    public set items(val: ModelType[]) {
      this._items = val;

      this.store.items = this._items;
    }

    public get items(): ModelType[] {
      this._items = this.store.items ? this.store.items.map((item: ModelType) => new this.Model(
        item.data, item.id,
      )) : [];

      return this._items;
    }

    public get(id: string): ModelType | undefined {
      return this.items.find((item) => item.id === id);
    }

    public getByDataKey(key: string, value: unknown): ModelType | undefined {
      return this.items.find((item: ModelType) => item.data[key] === value);
    }

    public remove(id: string): void {
      this.items = this.items.filter((item) => item.id !== id);
    }

    public save(): void {
      this.items = this._items;
    }

    // TODO - move to static method
    // eslint-disable-next-line class-methods-use-this
    public buildPayload(items: ModelType[]): MultipleItemResponse {
      return {
        items: items.map((item) => item.asResponse),
      };
    }
}
