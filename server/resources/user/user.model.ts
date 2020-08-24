import { BaseModel } from '@server/resources/base';
import { Intercept, InterceptService } from '@server/resources/intercept';

export interface UserData {
    key: string;
    intercepts: {
        [key: string]: string;
    };
}

export class User extends BaseModel< UserData > {
  constructor(
        public data: UserData,
        id?: string,
  ) {
    super(data, 'user', id);
  }

  public get Intercepts(): Intercept[] {
    return Object.keys(this.data.intercepts)
      .map((id) => InterceptService.get(id))
      .filter((intercept) => intercept !== undefined)
      .map((intercept) => intercept as Intercept);
  }
}
