import { ConditionState } from './condition';
import { DomainState } from './domain';
import { InterceptState } from './intercept';
import { ResponseState } from './response';
import { SnapshotState } from './snapshot';
import { UserState } from './user';

export interface ResourceModuleState {
  condition: ConditionState;
  domain: DomainState;
  intercept: InterceptState;
  response: ResponseState;
  snapshot: SnapshotState;
  user: UserState;
}
