import {
  ActionTree, ActionContext, GetterTree, MutationTree, Module,
} from 'vuex';
import { PatchOperation } from '@definitions';
import { ResourceModuleState } from '@client/store/resource/ResourceModuleState';

export interface RootState {
  version: number;
  resources?: ResourceModuleState;
}

export interface ResourceActions<Resource> extends ActionTree<ResourceState<Resource>, RootState> {
    get: (ctx: ActionContext<ResourceState<Resource>, RootState>, id: string) => Promise<void>;

    getMany: (
        ctx: ActionContext<ResourceState<Resource>, RootState>,
        // Allow passing any query params
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params?: any
    ) => Promise<void>;
    remove: (ctx: ActionContext<ResourceState<Resource>, RootState>, id: string) => Promise<void>;
    update: (
      ctx: ActionContext<ResourceState<Resource>, RootState>,
      payload: { identifier: string; operations: PatchOperation[] }
    ) => Promise<void>;

    // TODO - type creation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create: (ctx: ActionContext<ResourceState<Resource>, RootState>, item: any) => Promise<any>;
  }

export interface ResourceGetters<Resource> extends GetterTree<ResourceState<Resource>, RootState>{
    errors: (state: ResourceState<Resource>) => string[];
    failed: (state: ResourceState<Resource>) => boolean;
    fetching: (state: ResourceState<Resource>) => boolean;
    item: (state: ResourceState<Resource>) => (id: string) => Resource | undefined;
    itemByData: <D extends unknown> (state: ResourceState<Resource>) =>
      (key: string, value: D) =>
        Resource | undefined;
    items: (state: ResourceState<Resource>) => Resource[];
}

export interface ResourceMutations<Resource> extends MutationTree<ResourceState<Resource>> {
    remove: (state: ResourceState<Resource>, id: string) => void;
    saveItem: (state: ResourceState<Resource>, item: Resource) => void;
    saveItems: (state: ResourceState<Resource>, items: Resource[]) => void;
    removeAll: (state: ResourceState<Resource>) => void;
    fetching: (state: ResourceState<Resource>) => void;
    fetched: (state: ResourceState<Resource>, payload: {status: number}) => void;
    failed: (state: ResourceState<Resource>, payload: { status: number; errors: string[] }) => void;
}

export interface ResourceMetaState {
    errors: string[];
    failed: boolean;
    fetching: boolean;
    status: number | null;
}

export interface ResourceState< Resource > {
    items: {
        [key: string]: Resource;
    };
    meta: ResourceMetaState;
}

export interface ResourceModule<Resource> extends Module<ResourceState<Resource>, RootState> {
    namespaced: true;
    state: ResourceState<Resource>;
    getters: ResourceGetters<Resource>;
    actions: ResourceActions<Resource>;
    mutations: ResourceMutations<Resource>;
  }
