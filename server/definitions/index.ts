import { ConditionServiceClass } from '@server/resources/condition/condition.service';
import { DomainServiceClass } from '@server/resources/domain/domain.service';
import { InterceptServiceClass } from '@server/resources/intercept/intercept.service';
import { ResponseServiceClass } from '@server/resources/response/response.service';
import { SnapshotServiceClass } from '@server/resources/snapshot/snapshot.service';
import { UserServiceClass } from '@server/resources/user/user.service';

export type ServiceClass =
    ConditionServiceClass |
    DomainServiceClass |
    InterceptServiceClass |
    ResponseServiceClass |
    UserServiceClass |
    SnapshotServiceClass;
