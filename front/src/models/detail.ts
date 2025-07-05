import { getDetailAPI, getStatisticsAPI, getOtherAPI } from '@/api/works';
import { Effect, Reducer } from 'umi';

export interface DetailModelState {
  data: any;
  statistics: {
    praise: number;
    favorite: number;
    comment: number;
  };
  otherList: any[];
  otherPageParams: {
    current: number;
    pageSize: number;
    total: number;
    totalPage: number;
  };
}

export interface DetailModelType {
  namespace: 'detail';
  state: DetailModelState;
  effects: {
    fetchOther: Effect;
    fetchStatistics: Effect;
    fetchDetail: Effect;
  };
  reducers: {
    saveState: Reducer<DetailModelState>;
  };
}

const Model: DetailModelType = {
  namespace: 'detail',
  state: {
    data: {}, // 图片详情
    statistics: {
      // 点赞 收藏 评论数量统计
      praise: 0,
      favorite: 0,
      comment: 0,
    },
    otherList: [], // 作者上传的其他图片
    otherPageParams: {
      total: 0,
      totalPage: 0,
      current: 1,
      pageSize: 5,
    },
  },
  effects: {
    // 获取作者上传的其他图片
    *fetchOther({ payload = {} }, { call, put }) {
      const res = yield call(getOtherAPI, payload);
      const { code, data, message, ...pageParams } = res;
      if (code === 0) {
        yield put({
          type: 'saveState',
          payload: {
            otherList: data,
            otherPageParams: pageParams,
          },
        });
      }
      return res;
    },
    // 获取统计数量
    *fetchStatistics({ payload = {} }, { call, put }) {
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
    // 获取作品详情
    *fetchDetail({ payload = {} }, { call, put }) {
      const res = yield call(getDetailAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        yield put({
          type: 'saveState',
          payload: {
            data: data,
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
