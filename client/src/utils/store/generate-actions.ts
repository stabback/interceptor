import { Commit } from 'vuex';
import { ResourceActions } from './resource-module';

interface PatchOperation {
    op: string;
    path: string;
    value?: string;
}

export async function call(
  commit: Commit, url: string, params: RequestInit = {},
): Promise<Response | undefined> {
  commit('fetching');
  let res;
  try {
    res = await fetch(url, params);
  } catch (e) {
    commit('failed', {
      errors: [
        {
          id: 'FETCH_REQUEST_FAILED',
          message: 'An unknown error occured.  Check your network, or try again later.',
        },
      ],
      status: null,
    });
    return undefined;
  }

  return res;
}

// FETCH API response is any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function parse(commit: Commit, res: Response): Promise<any | undefined> {
  let body;
  try {
    body = await res.json();
  } catch (e) {
    body = '';
  }

  return body;
}

// FETCH API response is any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function callIsError(commit: Commit, res: Response, body: any): boolean {
  if (res.status >= 400) {
    commit('failed', {
      errors: body.items,
      status: res.status,
    });

    return true;
  }

  return false;
}

export async function wrapup(commit: Commit, res: Response): Promise< void> {
  commit('fetched', { status: res.status });
}

export function generateActions<Resource>(url: string):
        ResourceActions<Resource> {
  return {
    async get({ commit }, identifier) {
      const res = await call(commit, `${url}/${identifier}`);
      if (!res) { return; }

      const body = await parse(commit, res);
      if (!body) { return; }

      if (callIsError(commit, res, body)) { return; }

      commit('saveItem', body);

      wrapup(commit, res);
    },

    // Allow passing any query params
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getMany({ commit }, params = null) {
      let queryString = '';
      if (params) {
        queryString = Object.keys(params)
          .map((key: string) => `${key}=${params[key]}`)
          .join('&');
      }

      const res = await call(commit, `${url}?${queryString}`);
      if (!res) { return; }

      const body = await parse(commit, res);
      if (!body) { return; }

      if (callIsError(commit, res, body)) {
        return;
      }
      if (!body.items) {
        commit('failed', {
          errors: [
            {
              id: 'GET_ALL_INVALID_RESPONSE',
              message: 'Get all request did not return a valid response.',
            },
          ],
          status: res.status,
        });
      }

      commit('saveItems', body.items);

      wrapup(commit, res);
    },

    async remove({ commit }, id) {
      const res = await call(commit, `${url}/${id}`, { method: 'DELETE' });
      if (!res) { return; }

      const body = await parse(commit, res);

      if (callIsError(commit, res, body)) { return; }

      commit('remove', id);

      wrapup(commit, res);
    },

    async update({ commit }, payload) {
      const res = await call(commit, `${url}/${payload.identifier}`, {
        body: JSON.stringify({ updates: payload.operations }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      });
      if (!res) { return; }

      const body = await parse(commit, res);
      if (!body) { return; }

      if (callIsError(commit, res, body)) { return; }

      commit('saveItem', body);

      wrapup(commit, res);
    },

    // FETCH API response is any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async create({ commit }, item) {
      const res = await call(commit, url, {
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!res) { return ''; }

      const body = await parse(commit, res);
      if (!body) { return ''; }

      if (callIsError(commit, res, body)) {
        return '';
      }

      commit('saveItem', body);

      wrapup(commit, res);

      return body;
    },
  };
}
