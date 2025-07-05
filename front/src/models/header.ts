import { getInfoAPI } from '@/api/user';
import { getAllPraiseAPI } from '@/api/praiseStatus';
import { getAllAttentionAPI } from '@/api/attentionStatus';
import { getAllFavoritesAPI } from '@/api/favoritesItems';
import { Effect, Reducer } from 'umi';

export interface HeaderModelState {
  keyword: string;
  searchLoading: boolean;
  userInfo: any;
  allPraise: any[];
  allAttention: any[];
  allFavorites: any[];
}

export interface HeaderModelType {
  namespace: 'header';
  state: HeaderModelState;
  effects: {
    fetchUserInfo: Effect;
    fetchAllPraise: Effect;
    fetchAllAttention: Effect;
    fetchAllFavorites: Effect;
  };
  reducers: {
    saveState: Reducer<HeaderModelState>;
    updateUserInfo: Reducer<HeaderModelState>;
    clearUserInfo: Reducer<HeaderModelState>;
    saveSearchLoading: Reducer<HeaderModelState>;
  };
}

const Model: HeaderModelType = {
  namespace: 'header',
  state: {
    keyword: '',
    searchLoading: false,
    userInfo: {},
    allPraise: [],
    allAttention: [],
    allFavorites: [],
  },
  effects: {
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
    *fetchAllPraise({ payload = {} }, { call, put }) {
      const res = yield call(getAllPraiseAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        yield put({
          type: 'saveState',
          payload: {
            allPraise: data,
          },
        });
      }
      return res;
    },
    *fetchAllAttention({ payload = {} }, { call, put }) {
      const res = yield call(getAllAttentionAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        yield put({
          type: 'saveState',
          payload: {
            allAttention: data,
          },
        });
      }
      return res;
    },
    *fetchAllFavorites({ payload = {} }, { call, put }) {
      const res = yield call(getAllFavoritesAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        yield put({
          type: 'saveState',
          payload: {
            allFavorites: data,
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
      } as HeaderModelState;
    },
    clearUserInfo(state) {
      return {
        ...state,
        userInfo: {},
      } as HeaderModelState;
    },
    updateUserInfo(state, { payload }) {
      const { userInfo } = payload;
      const { userInfo: oldUserInfo } = state || {};
      const newUserInfo = {
        ...oldUserInfo,
        ...userInfo,
      };
      return {
        ...state,
        userInfo: newUserInfo,
      } as HeaderModelState;
    },
    saveSearchLoading(state, { payload }) {
      const { searchLoading } = payload;
      return {
        ...state,
        searchLoading,
      } as HeaderModelState;
    },
  },
};

export default Model;
