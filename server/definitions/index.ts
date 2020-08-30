import { ConditionService } from '@server/resources/condition/condition.service';
import { DomainService } from '@server/resources/domain/domain.service';
import { InterceptService } from '@server/resources/intercept/intercept.service';
import { ResponseService } from '@server/resources/response/response.service';
import { UserService } from '@server/resources/user/user.service';

export type Service =
    ConditionService |
    DomainService |
    InterceptService |
    ResponseService |
    UserService
