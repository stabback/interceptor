export enum ResourceName {
    condition = 'condition',
    domain = 'domain',
    error = 'error',
    intercept = 'intercept',
    response = 'response',
    snapshot = 'snapshot',
    user = 'user',
}

export type ResourceNames = keyof typeof ResourceName;

export interface BaseResource {
    id: string;
    type: any;
    data: {
        [key: string]: any;
    };
}

export interface Resource< Type, DataType > extends BaseResource {
    id: string;
    type: Type ;
    data: DataType;
}

export interface MultipleItemResponse {
    items: BaseResource[];
}

export interface PatchOperation {
    op: string;
    path: string;
    value?: string;
}
