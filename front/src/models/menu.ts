import { getMbStatisticsAPI } from '@/api/user';
import { Effect, Reducer } from 'umi';

export interface MobileMenuModelState {
  statistics: {
    contributeCount: number;
    attentionCount: number;
    favoriteCount: number;
  };
}

export interface MobileMenuModelType {
  namespace: 'mobileMenu';
  state: MobileMenuModelState;
  effects: {
    fetchUserStatisticsAPI: Effect;
  };
  reducers: {
    saveState: Reducer<MobileMenuModelState>;
  };
}

const Model: MobileMenuModelType = {
  namespace: 'mobileMenu',
  state: {
    statistics: {
      contributeCount: 0,
      attentionCount: 0,
      favoriteCount: 0,
    },
  },
  effects: {
    *fetchUserStatisticsAPI({ payload = {} }, { call, put }) {
      const res = yield call(getMbStatisticsAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        yield put({
          type: 'saveState',
          payload: {
            statistics: data,
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
