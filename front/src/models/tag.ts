import { getTagListAPI, addTagAPI } from '@/api/tag';
import { Effect, Reducer } from 'umi';

export interface TagsModelState {
  selectedTag: string;
  tagsList: any[];
}

export interface TagsModelType {
  namespace: 'tags';
  state: TagsModelState;
  effects: {
    fetchList: Effect;
    addTag: Effect;
  };
  reducers: {
    saveState: Reducer<TagsModelState>;
    saveList: Reducer<TagsModelState>;
    saveSelectedTag: Reducer<TagsModelState>;
  };
}

const Model: TagsModelType = {
  namespace: 'tags',
  state: {
    selectedTag: '',
    tagsList: [],
  },
  effects: {
    *fetchList({ payload = {} }, { call, put }) {
      const res = yield call(getTagListAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        yield put({
          type: 'saveState',
          payload: {
            tagsList: data,
          },
        });
      }
      return res;
    },
    *addTag({ payload = {} }, { call, put }) {
      const res = yield call(addTagAPI, payload);
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
    saveList(state, { payload }) {
      const { tagsList } = payload;
      return {
        ...state,
        tagsList,
      } as TagsModelState;
    },
    saveSelectedTag(state, { payload }) {
      const { selectedTag } = payload;
      return {
        ...state,
        selectedTag,
      } as TagsModelState;
    },
  },
};

export default Model;
