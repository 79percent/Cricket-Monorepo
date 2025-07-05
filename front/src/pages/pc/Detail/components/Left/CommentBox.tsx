import React, { useState, useEffect } from 'react';
import styles from './CommentBox.less';
import Comment from '@/components/pc/Comment';
import { connect, DetailModelState, LoginModelState, useModel } from 'umi';
import { addCommentAPI } from '@/api/comments';
import { addReplyAPI } from '@/api/reply';
import { updateCommentStatusAPI } from '@/api/commentStatus';
import { updateReplyStatusAPI } from '@/api/replyStatus';

const CommentBox = (props) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitting2, setSubmitting2] = useState(false);
  const [value1, setValue1] = useState(''); // 上方评论
  const [value2, setValue2] = useState(''); // 回复
  const { detail, id, login, dispatch } = props;
  const { initialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser || {};
  const { userId } = login;
  const {
    statistics,
    comments,
    commentReplyCount,
    commentStatus,
    commentUserStatus,
    commentsPageParams,
    replys,
    replyStatus,
    replyUserStatus,
    replyExpand,
    replyPageParams,
    recommendList,
    recommendPageParams,
  } = detail;
  const commentProps = {
    commentValue: value1,
    commentSubmitting: submitting,
    replyValue: value2,
    replySubmitting: submitting2,
    userInfo,
    comments,
    commentReplyCount,
    commentStatus,
    commentUserStatus,
    commentsPageParams,
    replys,
    replyStatus,
    replyUserStatus,
    replyExpand,
    replyPageParams,
    recommendList,
    recommendPageParams,
    onChangeComment: (value) => {
      setValue1(value);
    },
    onSumbitComment: async (value) => {
      setSubmitting(true);
      const res = await addCommentAPI({
        workId: id,
        content: value,
      }).finally(() => {
        setSubmitting(false);
      });
      const { code, data } = res;
      if (code === 0) {
        setValue1('');
        const newComments = [...comments, data];
        const { _id } = data;
        const newCommentReplyCount = {
          ...commentReplyCount,
          [_id]: 0,
        };
        const newCommentStatus = {
          ...commentStatus,
          [_id]: {
            like: 0,
            disLike: 0,
          },
        };
        const newStatistics = { ...statistics };
        newStatistics.comment += 1;
        dispatch({
          type: 'detail/saveState',
          payload: {
            comments: newComments,
            commentReplyCount: newCommentReplyCount,
            commentStatus: newCommentStatus,
            statistics: newStatistics,
          },
        });
      }
    },
    onLikeComment: async (commentId, status, index) => {
      const res = await updateCommentStatusAPI({
        id: commentId,
        status: status ? 1 : 0,
        workId: id,
      });
      if (res.code === 0) {
        dispatch({
          type: 'detail/fetchCommentStatusById',
          payload: {
            id: commentId,
          },
        });
        dispatch({
          type: 'detail/fetchCommentStatus',
          payload: {
            workId: id,
            userId,
          },
        });
      }
    },
    onDisLikeComment: async (commentId, status, index) => {
      const res = await updateCommentStatusAPI({
        id: commentId,
        status: status ? 2 : 0,
        workId: id,
      });
      if (res.code === 0) {
        dispatch({
          type: 'detail/fetchCommentStatusById',
          payload: {
            id: commentId,
          },
        });
        dispatch({
          type: 'detail/fetchCommentStatus',
          payload: {
            workId: id,
            userId,
          },
        });
      }
    },
    onChangeReply: (value) => {
      setValue2(value);
    },
    onSumbitReply: async (
      value: string,
      index: number,
      index2: number,
      comment: any,
      targetUser: any,
      parentReply: any,
    ) => {
      const res = await addReplyAPI({
        commentId: comment?._id,
        workId: id,
        content: value,
        parentId: parentReply?._id,
        targetUserId: targetUser?._id,
      });
      const { code, data } = res;
      if (code === 0) {
        const newReplys = { ...replys };
        if (!Array.isArray(newReplys[comment?._id])) {
          newReplys[comment?._id] = [];
        }
        newReplys[comment?._id].push(data);
        const newCommentReplyCount = { ...commentReplyCount };
        if (typeof newCommentReplyCount[comment?._id] !== 'number') {
          newCommentReplyCount[comment?._id] = 0;
        }
        newCommentReplyCount[comment?._id] += 1;
        const newStatistics = { ...statistics };
        newStatistics.comment += 1;
        const newReplyPageParams = {
          ...replyPageParams,
        };
        if (!newReplyPageParams[comment?._id]) {
          newReplyPageParams[comment?._id] = {
            total: 1,
            totalPage: 1,
            current: 1,
            pageSize: 3,
          };
        } else if (newReplyPageParams[comment?._id].total === 0) {
          newReplyPageParams[comment?._id].total += 1;
        }
        dispatch({
          type: 'detail/saveState',
          payload: {
            replys: newReplys,
            commentReplyCount: newCommentReplyCount,
            statistics: newStatistics,
            replyPageParams: newReplyPageParams,
          },
        });
        setValue2('');
      }
    },
    onLikeReply: async (
      replyId: string,
      status: boolean,
      index: number,
      index2: number,
    ) => {
      const res = await updateReplyStatusAPI({
        id: replyId,
        status: status ? 1 : 0,
        workId: id,
      });
      if (res.code === 0) {
        dispatch({
          type: 'detail/fetchReplyStatusByIdAPI',
          payload: {
            id: replyId,
          },
        });
        dispatch({
          type: 'detail/fetchReplyStatus',
          payload: {
            workId: id,
            userId,
          },
        });
      }
    },
    onDisLikeReply: async (
      replyId: string,
      status: boolean,
      index: number,
      index2: number,
    ) => {
      const res = await updateReplyStatusAPI({
        id: replyId,
        status: status ? 2 : 0,
        workId: id,
      });
      if (res.code === 0) {
        dispatch({
          type: 'detail/fetchReplyStatusByIdAPI',
          payload: {
            id: replyId,
          },
        });
        dispatch({
          type: 'detail/fetchReplyStatus',
          payload: {
            workId: id,
            userId,
          },
        });
      }
    },
    fetchReplys: async (params = {}) => {
      await dispatch({
        type: 'detail/fetchReplyList',
        payload: params,
      });
    },
    refactorParams: (params = {}) => {
      return {
        ...params,
        workId: id,
      };
    },
    fetchNextPage: async (current: number, pageSize: number) => {
      await dispatch({
        type: 'detail/fetchCommentList',
        payload: {
          current,
          pageSize,
          workId: id,
        },
      });
    },
  };

  useEffect(() => {
    if (id) {
      dispatch({
        type: 'detail/fetchCommentList',
        payload: {
          current: 1,
          pageSize: 10,
          workId: id,
        },
      });
    }
    if (userId) {
      dispatch({
        type: 'detail/fetchCommentStatus',
        payload: {
          workId: id,
          userId,
        },
      });
      dispatch({
        type: 'detail/fetchReplyStatus',
        payload: {
          workId: id,
          userId,
        },
      });
    }
  }, [id, userId]);

  return (
    <div className={styles.leftComment}>
      <Comment {...commentProps} />
    </div>
  );
};

export default connect(
  ({
    detail,
    login,
  }: {
    detail: DetailModelState;
    login: LoginModelState;
  }) => ({
    detail,
    login,
  }),
)(CommentBox);
