import { getWorkListAPI } from '@/api/works';
import { Effect, Reducer } from 'umi';

export interface ContributeModelState {
  works: any[];
  worksPageParams: {
    current: number;
    pageSize: number;
    total: number;
    totalPage: number;
  };
}

export interface ContributeModelType {
  namespace: 'contribute';
  state: ContributeModelState;
  effects: {
    fetchWorks: Effect;
  };
  reducers: {
    saveState: Reducer<ContributeModelState>;
  };
}

const Model: ContributeModelType = {
  namespace: 'contribute',
  state: {
    works: [],
    worksPageParams: {
      current: 1,
      pageSize: 10,
      total: 0,
      totalPage: 0,
    },
  },
  effects: {
    *fetchWorks({ payload = {} }, { call, put }) {
      const res = yield call(getWorkListAPI, payload);
      const { code, data, message, ...pageParams } = res;
      if (code === 0) {
        const { list } = data;
        yield put({
          type: 'saveState',
          payload: {
            works: list,
            worksPageParams: pageParams,
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
