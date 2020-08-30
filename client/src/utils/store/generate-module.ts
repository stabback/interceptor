import { generateActions } from '@client/utils/store/generate-actions';
import { generateGetters } from '@client/utils/store/generate-getters';
import { generateMutations } from '@client/utils/store/generate-mutations';
import { generateResourceState } from '@client/utils/store/generate-state';
import { SerializedDocument } from '@definitions';
import { ResourceModule } from './resource-module';

export function generateModule<Resource extends SerializedDocument>(path: string):
  ResourceModule<Resource> {
  return {
    namespaced: true,
    state: generateResourceState< Resource>(),
    getters: generateGetters< Resource >(),
    actions: generateActions< Resource>(`/command/${path}`),
    mutations: generateMutations< Resource >(),
  };
}
