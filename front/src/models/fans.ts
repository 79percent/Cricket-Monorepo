import { getFansListAPI } from '@/api/attentionStatus';
import { Effect, Reducer } from 'umi';

export interface FansModelState {
  list: any[];
  pageParams: {
    current: number;
    pageSize: number;
    total: number;
    totalPage: number;
  };
}

export interface FansModelType {
  namespace: 'fans';
  state: FansModelState;
  effects: {
    fetchFansList: Effect;
  };
  reducers: {
    saveState: Reducer<FansModelState>;
  };
}

const Model: FansModelType = {
  namespace: 'fans',
  state: {
    list: [],
    pageParams: {
      current: 1,
      pageSize: 10,
      total: 0,
      totalPage: 0,
    },
  },
  effects: {
    *fetchFansList({ payload = {} }, { call, put }) {
      const res = yield call(getFansListAPI, payload);
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
