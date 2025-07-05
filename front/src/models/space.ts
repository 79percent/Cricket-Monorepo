import { getInfoAPI, getStatisticsAPI } from '@/api/user';
import { getWorkListAPI } from '@/api/works';
import { Effect, Reducer } from 'umi';

export interface SpaceModelState {
  userInfo: any;
  statistics: {
    contributeCount: number;
    attentionCount: number;
    fansCount: number;
  };
  tabActive: string;
}

export interface SpaceModelType {
  namespace: 'space';
  state: SpaceModelState;
  effects: {
    fetchUserStatisticsAPI: Effect;
    fetchUserInfo: Effect;
  };
  reducers: {
    saveState: Reducer<SpaceModelState>;
  };
}

const Model: SpaceModelType = {
  namespace: 'space',
  state: {
    userInfo: {},
    statistics: {
      contributeCount: 0,
      attentionCount: 0,
      fansCount: 0,
    },
    tabActive: '1',
  },
  effects: {
    *fetchUserStatisticsAPI({ payload = {} }, { call, put }) {
      const res = yield call(getStatisticsAPI, payload);
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
    *fetchUserInfo({ payload = {} }, { call, put }) {
      const res = yield call(getInfoAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        yield put({
          type: 'saveState',
          payload: {
            userInfo: data,
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
