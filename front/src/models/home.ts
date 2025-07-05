import { getWorkListAPI } from '@/api/works';
import { getFavoritesCountAPI } from '@/api/favoritesItems';
import { Effect, Reducer } from 'umi';

export interface HomeModelState {
  worksList: any[];
  searchParams: {
    keyword: string;
  };
  pageParams: {
    current: number;
    pageSize: number;
    total: number;
    totalPage: number;
  };
  praiseCount: any;
  favoriteCount: any;
}

export interface HomeModelType {
  namespace: 'home';
  state: HomeModelState;
  effects: {
    fetchWorksList: Effect;
    fetchFavoritesCountAPI: Effect;
  };
  reducers: {
    saveState: Reducer<HomeModelState>;
    saveNewCount: Reducer<HomeModelState>;
    saveWorksList: Reducer<HomeModelState>;
  };
}

const Model: HomeModelType = {
  namespace: 'home',
  state: {
    worksList: [],
    searchParams: {
      keyword: '',
    },
    pageParams: {
      current: 1,
      pageSize: 20,
      total: 0,
      totalPage: 0,
    },
    praiseCount: {},
    favoriteCount: {},
  },
  effects: {
    *fetchWorksList({ payload = {} }, { call, put }) {
      const { keyword } = payload;
      const res = yield call(getWorkListAPI, payload);
      const { code, data, message, ...pageParams } = res;
      if (code === 0) {
        const { list, praiseCount, favoriteCount } = data;
        yield put({
          type: 'saveWorksList',
          payload: {
            worksList: list,
            pageParams,
            praiseCount,
            favoriteCount,
            searchParams: {
              keyword,
            },
          },
        });
      }
      return res;
    },
    *fetchFavoritesCountAPI({ payload = {} }, { call, put }) {
      const res = yield call(getFavoritesCountAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        yield put({
          type: 'saveNewCount',
          payload: {
            data,
          },
        });
      }
      return res;
    },
  },
  reducers: {
    saveNewCount(state, { payload }) {
      const { data } = payload;
      const { favoriteCount } = state || {};
      return {
        ...state,
        favoriteCount: {
          ...favoriteCount,
          ...data,
        },
      } as HomeModelState;
    },
    saveWorksList(state, { payload }) {
      const { worksList, pageParams, praiseCount, favoriteCount } = payload;
      let newList: any[] = [];
      let newPraise = {};
      let newFavorite = {};
      if (pageParams.current === 1) {
        newList = worksList;
        newPraise = praiseCount;
        newFavorite = favoriteCount;
      } else {
        // 过滤重复
        const filterList: any[] = [];
        worksList.forEach((item) => {
          let flag = true;
          state?.worksList.forEach((item2) => {
            if (item._id === item2._id) {
              flag = false;
            }
          });
          if (flag) {
            filterList.push(item);
          }
        });
        const {
          worksList: oldList = [],
          praiseCount: oldPraise = {},
          favoriteCount: oldFavorite = {},
        } = state || {};
        newList = [...oldList, ...filterList];
        newPraise = { ...oldPraise, ...praiseCount };
        newFavorite = { ...oldFavorite, ...favoriteCount };
      }
      return {
        ...state,
        ...payload,
        worksList: newList,
        praiseCount: newPraise,
        favoriteCount: newFavorite,
      } as HomeModelState;
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
