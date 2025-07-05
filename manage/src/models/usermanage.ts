/**
 * 用户管理
 */
import type { Effect, Reducer } from 'umi';
import { getUserListAPI } from '@/api/user';

export interface UsermanageModelState {
  name: string;
  userList: API.UserInfo[];
}

export interface UsermanageModelType {
  namespace: 'usermanage';
  state: UsermanageModelState;
  effects: {
    /** 获取用户列表 */
    queryUserList: Effect;
  };
  reducers: {
    save: Reducer<UsermanageModelState>;
  };
}

const IndexModel: UsermanageModelType = {
  namespace: 'usermanage',

  state: {
    name: '',
    userList: [],
  },

  effects: {
    *queryUserList({ payload }, { call, put }) {
      const res = yield call(getUserListAPI, payload);
      const { code, data } = res || {};
      if (code === 0) {
        yield put({
          type: 'save',
          payload: {
            userList: data,
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
