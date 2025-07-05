/**
 * 账号管理
 */
import type { Effect, Reducer } from 'umi';
import { getInfoAPI } from '@/api/user';

export interface AccountModelState {
  name: string;
  userInfo: API.UserInfo | undefined;
}

export interface AccountModelType {
  namespace: 'account';
  state: AccountModelState;
  effects: {
    queryUserInfo: Effect;
  };
  reducers: {
    save: Reducer<AccountModelState>;
  };
}

const IndexModel: AccountModelType = {
  namespace: 'account',

  state: {
    name: '',
    userInfo: undefined,
  },

  effects: {
    *queryUserInfo({ payload }, { call, put }) {
      const res = yield call(getInfoAPI, payload);
      const { code, data } = res || {};
      if (code === 0) {
        yield put({
          type: 'save',
          payload: {
            userInfo: data,
          },
        });
      }
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default IndexModel;
