import { getAttentionListAPI } from '@/api/attentionStatus';
import { Effect, Reducer } from 'umi';

export interface AttentionsModelState {
  list: any[];
  pageParams: {
    current: number;
    pageSize: number;
    total: number;
    totalPage: number;
  };
}

export interface AttentionsModelType {
  namespace: 'attentions';
  state: AttentionsModelState;
  effects: {
    fetchAttentionList: Effect;
  };
  reducers: {
    saveState: Reducer<AttentionsModelState>;
  };
}

const Model: AttentionsModelType = {
  namespace: 'attentions',
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
    *fetchAttentionList({ payload = {} }, { call, put }) {
      const res = yield call(getAttentionListAPI, payload);
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
