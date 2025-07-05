import { loginAPI } from '@/api/user';
import { Effect, Reducer } from 'umi';

export interface LoginModelState {
  needGoBack: boolean;
  userId: string | null;
}

export interface LoginModelType {
  namespace: 'login';
  state: LoginModelState;
  effects: {
    login: Effect;
    loginOut: Effect;
  };
  reducers: {
    saveState: Reducer<LoginModelState>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',
  state: {
    needGoBack: false,
    userId: localStorage.getItem('userId'),
  },
  effects: {
    *login({ payload = {} }, { call, put }) {
      const res = yield call(loginAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        const { id, token } = data;
        localStorage.setItem('userId', id);
        localStorage.setItem('token', token);
        yield put({
          type: 'saveState',
          payload: {
            userId: id,
          },
        });
      }
      return res;
    },
    *loginOut({}, { call, put }) {
      yield put({
        type: 'saveState',
        payload: {
          userId: null,
        },
      });
    },
  },
  reducers: {
    saveState(state, { payload = {} }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
