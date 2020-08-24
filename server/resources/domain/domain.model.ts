import { BaseModel } from '@server/resources/base';

export interface DomainData {
    intercepts: string[];
    key: string;
    name: string;
    url: string;
}

export class Domain extends BaseModel< DomainData > {
  constructor(
        public data: DomainData,
        id?: string,
  ) {
    super(data, 'domain', id);
  }

  public addIntercept(id: string) {
    this.data.intercepts.push(id);
  }

  public removeIntercept(id: string) {
    this.data.intercepts = this.data.intercepts.filter((thisId) => thisId !== id);
  }
}
