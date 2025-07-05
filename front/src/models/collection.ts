import { getFavoriteItemsListAPI } from '@/api/favoritesItems';
import { Effect, Reducer } from 'umi';

export interface CollectionModelState {
  favoritesKey: string[];
  list: any[];
  pageParams: {
    current: number;
    pageSize: number;
    total: number;
    totalPage: number;
  };
}

export interface CollectionModelType {
  namespace: 'collection';
  state: CollectionModelState;
  effects: {
    fetchFavoriteItemsList: Effect;
  };
  reducers: {
    saveState: Reducer<CollectionModelState>;
  };
}

const Model: CollectionModelType = {
  namespace: 'collection',
  state: {
    favoritesKey: [],
    list: [],
    pageParams: {
      current: 1,
      pageSize: 10,
      total: 0,
      totalPage: 0,
    },
  },
  effects: {
    *fetchFavoriteItemsList({ payload = {} }, { call, put }) {
      const res = yield call(getFavoriteItemsListAPI, payload);
      const { code, data, message, ...pageParams } = res;
      if (code === 0) {
        yield put({
          type: 'saveState',
          payload: {
            list: data,
            pageParams,
          },
        });
      }
      return res;
    },
  },
  reducers: {
    saveState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
