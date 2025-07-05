import { getAllFavoritesAPI, addFavoriteAPI } from '@/api/favorites';
import { getWorkFavoriteAPI, getFavoritesCountAPI } from '@/api/favoritesItems';
import { Effect, Reducer } from 'umi';

export interface FavoritesModelState {
  list: any[];
  countMap: any;
  favoritesArr: any[];
}

export interface FavoritesModelType {
  namespace: 'favorites';
  state: FavoritesModelState;
  effects: {
    addFavorite: Effect;
    fetchAllFavorites: Effect;
    fetchWorkFavoriteAPI: Effect;
  };
  reducers: {
    saveState: Reducer<FavoritesModelState>;
    pushNewFavorite: Reducer<FavoritesModelState>;
  };
}

const Model: FavoritesModelType = {
  namespace: 'favorites',
  state: {
    list: [],
    countMap: {},
    favoritesArr: [],
  },
  effects: {
    *addFavorite({ payload = {} }, { call, put }) {
      const res = yield call(addFavoriteAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        yield put({
          type: 'pushNewFavorite',
          payload: {
            favorite: data,
          },
        });
      }
      return res;
    },
    *fetchAllFavorites({ payload = {} }, { call, put }) {
      const res = yield call(getAllFavoritesAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        const { list, countMap } = data;
        yield put({
          type: 'saveState',
          payload: {
            list,
            countMap,
          },
        });
      }
      return res;
    },
    *fetchWorkFavoriteAPI({ payload = {} }, { call, put }) {
      const res = yield call(getWorkFavoriteAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        yield put({
          type: 'saveState',
          payload: {
            favoritesArr: data,
          },
        });
      }
      return res;
    },
  },
  reducers: {
    pushNewFavorite(state, { payload }) {
      const { favorite } = payload;
      const { list = [], countMap } = state || {};
      list.push(favorite);
      countMap[favorite._id] = 0;
      return {
        ...state,
        list: [...list],
        countMap: { ...countMap },
      } as FavoritesModelState;
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
