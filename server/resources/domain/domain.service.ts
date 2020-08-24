import { BaseService } from '@server/resources/base';
import { Domain } from './domain.model';

export class DomainServiceClass extends BaseService< Domain > {
  constructor() {
    super(
      'service',
      Domain,
    );
  }

  public create(name: string, url: string, key: string): Domain {
    if (this.items.some((s) => s.data.key === key)) {
      throw new Error(`Attempting to create a domain with a key that already exists - ${key} - ${name}`);
    }

    const domain = new Domain({
      intercepts: [],
      key,
      name,
      url,
    });

    this.items = [
      ...this.items,
      domain,
    ];

    return domain;
  }

  public getByKey(key: string): Domain | undefined {
    return this.getByDataKey('key', key);
  }
}

const DOMAIN = new DomainServiceClass();

export default DOMAIN;
