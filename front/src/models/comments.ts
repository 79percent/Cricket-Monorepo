import { getCommentListAPI } from '@/api/comments';
import {
  getAllStatusAPI as getCommentStatusAPI,
  getCommentStatusByIdAPI,
} from '@/api/commentStatus';
import { getReplyListAPI } from '@/api/reply';
import {
  getAllStatusAPI as getReplyStatusAPI,
  getReplyStatusByIdAPI,
} from '@/api/replyStatus';
import { Effect, Reducer } from 'umi';

export interface CommentsModelState {
  comments: any[]; // 评论
  commentReplyCount: any; // 评论回复数量
  commentStatus: any; // 评论 点赞点踩数量 like disLike
  commentUserStatus: any[]; // 评论 用户点赞点踩状态
  commentsPageParams: {
    total: number;
    totalPage: number;
    current: number;
    pageSize: number;
  };
  replys: any; // 回复
  replyStatus: any; // 回复 点赞点踩数量
  replyUserStatus: any[]; // 回复 用户点赞点踩状态
  replyPageParams: {
    total: number;
    totalPage: number;
    current: number;
    pageSize: number;
  };
}

export interface CommentsModelType {
  namespace: 'comments';
  state: CommentsModelState;
  effects: {
    fetchReplyStatus: Effect;
    fetchReplyList: Effect;
    fetchReplyStatusByIdAPI: Effect;
    fetchCommentStatusById: Effect;
    fetchCommentStatus: Effect;
    fetchCommentList: Effect;
  };
  reducers: {
    saveReplys: Reducer<CommentsModelState>;
    saveComments: Reducer<CommentsModelState>;
    saveCommentStatus: Reducer<CommentsModelState>;
    saveReplyStatus: Reducer<CommentsModelState>;
    saveState: Reducer<CommentsModelState>;
  };
}

const Model: CommentsModelType = {
  namespace: 'comments',
  state: {
    comments: [], // 评论
    commentReplyCount: {}, // 评论回复数量
    commentStatus: {}, // 评论 点赞点踩数量 like disLike
    commentUserStatus: [], // 评论 用户点赞点踩状态
    commentsPageParams: {
      total: 0,
      totalPage: 0,
      current: 1,
      pageSize: 20,
    },
    replys: {}, // 回复
    replyStatus: {}, // 回复 点赞点踩数量
    replyUserStatus: [], // 回复 用户点赞点踩状态
    replyPageParams: {
      total: 0,
      totalPage: 0,
      current: 1,
      pageSize: 5,
    },
  },
  effects: {
    // 获取用户回复点赞点踩状态
    *fetchReplyStatus({ payload = {} }, { call, put }) {
      const res = yield call(getReplyStatusAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        yield put({
          type: 'saveState',
          payload: {
            replyUserStatus: data,
          },
        });
      }
      return res;
    },
    // 获取回复列表
    *fetchReplyList({ payload }, { call, put }) {
      const res = yield call(getReplyListAPI, payload);
      const { code, data, message, ...pageParams } = res;
      if (code === 0) {
        const { commentId } = payload;
        const { list, statusMap } = data;
        yield put({
          type: 'saveReplys',
          payload: {
            reply: {
              [commentId]: list,
            },
            statusMap,
            pageParams: {
              [commentId]: pageParams,
            },
          },
        });
      }
      return res;
    },
    // 获取某条评论的点赞 点踩数量
    *fetchReplyStatusByIdAPI({ payload = {} }, { call, put }) {
      const res = yield call(getReplyStatusByIdAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        yield put({
          type: 'saveReplyStatus',
          payload: {
            data,
          },
        });
      }
      return res;
    },
    // 获取某条评论的点赞 点踩数量
    *fetchCommentStatusById({ payload = {} }, { call, put }) {
      const res = yield call(getCommentStatusByIdAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        yield put({
          type: 'saveCommentStatus',
          payload: {
            data,
          },
        });
      }
      return res;
    },
    // 获取用户评论点赞点踩状态
    *fetchCommentStatus({ payload = {} }, { call, put }) {
      const res = yield call(getCommentStatusAPI, payload);
      const { code, data } = res;
      if (code === 0) {
        yield put({
          type: 'saveState',
          payload: {
            commentUserStatus: data,
          },
        });
      }
      return res;
    },
    // 获取评论
    *fetchCommentList({ payload = {} }, { call, put }) {
      const res = yield call(getCommentListAPI, payload);
      const { code, data, message, ...pageParams } = res;
      if (code === 0) {
        const { list, replyCountMap, statusMap, replys } = data;
        yield put({
          type: 'saveComments',
          payload: {
            list,
            replyCountMap,
            statusMap,
            pageParams,
            replys,
          },
        });
      }
      return res;
    },
  },
  reducers: {
    saveReplys(state, { payload }) {
      const { reply, pageParams, statusMap } = payload;
      const {
        replys: oldReplys,
        replyStatus: oldReplyStatus,
        replyPageParams: oldReplyPageParams,
      } = state || {};
      return {
        ...state,
        replys: {
          ...oldReplys,
          ...reply,
        },
        replyStatus: {
          ...oldReplyStatus,
          ...statusMap,
        },
        replyPageParams: {
          ...oldReplyPageParams,
          ...pageParams,
        },
      } as CommentsModelState;
    },
    saveComments(state, { payload }) {
      const { list, replyCountMap, statusMap, pageParams, replys } = payload;
      const filterList: any[] = [...(state?.comments ?? [])];
      list.forEach((item) => {
        const flag =
          state?.comments.findIndex((item2) => item2._id === item._id) === -1;
        if (flag) {
          filterList.push(item);
        }
      });
      const entries = Object.entries(replys);
      let newReplys = { ...state?.replys };
      let newReplyStatus = { ...state?.replyStatus };
      let newReplyPageParams = { ...state?.replyPageParams };
      entries.forEach((item) => {
        const [commentId, data] = item;
        const {
          list: replyList,
          statusMap: replyStatusMap,
          pageParams: replyPageparams,
        } = data as any;
        newReplys = {
          ...newReplys,
          [commentId]: replyList,
        };
        newReplyStatus = {
          ...newReplyStatus,
          ...replyStatusMap,
        };
        newReplyPageParams = {
          ...newReplyPageParams,
          [commentId]: replyPageparams,
        };
      });
      return {
        ...state,
        comments: filterList,
        commentReplyCount: {
          ...state?.commentReplyCount,
          ...replyCountMap,
        },
        commentStatus: {
          ...state?.commentStatus,
          ...statusMap,
        },
        commentsPageParams: pageParams,
        replys: newReplys,
        replyStatus: newReplyStatus,
        replyPageParams: newReplyPageParams,
      } as CommentsModelState;
    },
    saveCommentStatus(state, { payload }) {
      const { data } = payload;
      const { commentStatus: oldCommentStatus } = state || {};
      return {
        ...state,
        commentStatus: {
          ...oldCommentStatus,
          ...data,
        },
      } as CommentsModelState;
    },
    saveReplyStatus(state, { payload }) {
      const { data } = payload;
      const { replyStatus: oldReplyStatus } = state || {};
      return {
        ...state,
        replyStatus: {
          ...oldReplyStatus,
          ...data,
        },
      } as CommentsModelState;
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
