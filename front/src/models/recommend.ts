import { getRecommendAPI } from '@/api/works';
import { Effect, Reducer } from 'umi';

export interface RecommendModelState {
  recommendListLoading: boolean;
  recommendList: any[]; // 相关推荐
  recommendPageParams: {
    total: number;
    totalPage: number;
    current: number;
    pageSize: number;
  };
}

export interface RecommendModelType {
  namespace: 'recommend';
  state: RecommendModelState;
  effects: {
    fetchRecommend: Effect;
    fetchNextRecommend: Effect;
  };
  reducers: {
    saveState: Reducer<RecommendModelState>;
    saveNextRecommend: Reducer<RecommendModelState>;
  };
}

const Model: RecommendModelType = {
  namespace: 'recommend',
  state: {
    recommendListLoading: false,
    recommendList: [], // 相关推荐
    recommendPageParams: {
      total: 0,
      totalPage: 0,
      current: 1,
      pageSize: 5,
    },
  },
  effects: {
    // 获取相关推荐
    *fetchRecommend({ payload = {} }, { call, put }) {
      const res = yield call(getRecommendAPI, payload);
      const { code, data, message, ...pageParams } = res;
      if (code === 0) {
        yield put({
          type: 'saveState',
          payload: {
            recommendList: data,
            recommendPageParams: pageParams,
          },
        });
      }
      return res;
    },
    // 获取相关推荐下一页
    *fetchNextRecommend({ payload = {} }, { call, put }) {
      const res = yield call(getRecommendAPI, payload);
      const { code, data, message, ...pageParams } = res;
      if (code === 0) {
        yield put({
          type: 'saveNextRecommend',
          payload: {
            recommendList: data,
            recommendPageParams: pageParams,
          },
        });
      }
      return res;
    },
  },
  reducers: {
    saveNextRecommend(state, { payload }) {
      const { recommendList, recommendPageParams } = payload;
      const { recommendList: oldList = [] } = state || {};
      const list = [...oldList];
      recommendList.forEach((item) => {
        if (oldList.every((o) => o._id !== item._id)) {
          list.push(item);
        }
      });
      return {
        ...state,
        recommendPageParams,
        recommendList: list,
      } as RecommendModelState;
    },
    saveState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
