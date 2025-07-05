import React, { createElement, useState } from 'react';
import { history, connect, Link } from 'umi';
import {
  Comment,
  Tooltip,
  Avatar,
  Form,
  Input,
  Button,
  Pagination,
} from 'antd';
import moment from 'moment';
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
  UserOutlined,
} from '@ant-design/icons';
import './commentStyles.less';
import './styles.less';
import Editor from './Editor';
import { Props } from './Props.d';

/**
 * 评论组件
 * @param param0
 */
const MyComment: React.FC<Props> = ({
  userInfo = {},
  commentValue = '',
  commentSubmitting = false,
  comments = [],
  commentReplyCount = {},
  commentStatus = {},
  commentUserStatus = [],
  commentsPageParams = {},
  replys = {},
  replyStatus = {},
  replyUserStatus = [],
  replyPageParams = {},
  replyValue = '',
  replySubmitting = false,
  onSumbitComment = () => {},
  onChangeComment = () => {},
  onLikeComment = () => {},
  onDisLikeComment = () => {},
  onChangeReply = () => {},
  onSumbitReply = () => {},
  onLikeReply = () => {},
  onDisLikeReply = () => {},
  fetchReplys = () => {},
  refactorParams = () => ({}),
  fetchNextPage = () => {},
}) => {
  const {
    current = 0,
    pageSize,
    totalPage = 0,
    total = 0,
  } = commentsPageParams;
  const [targetUser, setTargetUser] = useState<null | any>(null);
  const [targetIndex, setTargetIndex] = useState(-1);
  const [targetIndex2, setTargetIndex2] = useState(-1);
  const [parentReply, setParent] = useState<null | any>(null);
  const [targetComment, setTargetComment] = useState<null | any>(null);
  const [expandIndex, setExpandIndex] = useState<number[]>([]);
  const [fetchReplyIndex, setFetchReplyIndex] = useState<number[]>([]);

  // 时间、点赞、踩、回复、展开更多
  const renderActions = ({
    createTime = undefined,
    onLike = () => {},
    likes = 0,
    onDislike = () => {},
    dislikes = 0,
    showExpand = false,
    isLike = false,
    isHate = false,
    onClickReply = () => {},
    replyText = '',
    viewReplyText = '',
    onClickView = () => {},
  }) => [
    <div key="comment-basic-acitons" className="comment-actions-row">
      <Tooltip title={moment(createTime).format('YYYY-MM-DD HH:mm:ss')}>
        <span>{moment(createTime).fromNow()}</span>
      </Tooltip>
      <span onClick={onLike}>
        {createElement(isLike ? LikeFilled : LikeOutlined)}
        <span className="comment-action">{likes}</span>
      </span>
      <span onClick={onDislike}>
        {createElement(isHate ? DislikeFilled : DislikeOutlined)}
        <span className="comment-action">{dislikes}</span>
      </span>
      <span onClick={onClickReply}>{replyText}</span>
      {showExpand && (
        <span style={{ fontSize: 12, cursor: 'pointer' }} onClick={onClickView}>
          {viewReplyText}
        </span>
      )}
    </div>,
  ];

  // 点击评论回复
  const handleClickReply = (index1, index2, comment, user, parent) => {
    if (index1 === targetIndex && index2 === targetIndex2) {
      setTargetIndex(-1);
      setTargetIndex2(-1);
      setTargetComment(comment);
      setTargetUser(null);
      setParent(null);
    } else {
      setTargetIndex(index1);
      setTargetIndex2(index2);
      setTargetComment(comment);
      setTargetUser(user);
      setParent(parent);
    }
  };

  return (
    <div className="my-comment">
      <div className="header">所有评论</div>
      {/* 输入框 */}
      <Comment
        avatar={
          <Avatar
            icon={!userInfo?.avatar && <UserOutlined />}
            src={userInfo?.avatar}
            alt=""
          />
        }
        content={
          <Editor
            onChange={(e) => {
              onChangeComment(e.target.value);
            }}
            onSubmit={() => {
              onSumbitComment(commentValue);
            }}
            submitting={commentSubmitting}
            value={commentValue}
            placeholder="发表一条友善的评论"
            submitText="发表"
          />
        }
      />
      {/* 评论列表 */}
      {comments.map((item, index) => {
        const { _id, creator, content, createTime } = item;
        const isLike =
          commentUserStatus.findIndex(
            (item) => item.target === _id && item.status === 1,
          ) !== -1;
        const isHate =
          commentUserStatus.findIndex(
            (item) => item.target === _id && item.status === 2,
          ) !== -1;
        const replyCount = commentReplyCount[_id];
        const likeCount = commentStatus[_id]?.like || 0;
        const hateCount = commentStatus[_id]?.disLike || 0;
        const children = replys[_id] || [];
        return (
          <Comment
            key={_id}
            actions={renderActions({
              replyText:
                index === targetIndex && targetIndex2 === -1 ? '收起' : '回复',
              viewReplyText: '',
              createTime,
              onLike: () => onLikeComment(_id, !isLike, index),
              likes: likeCount,
              isLike,
              isHate,
              onDislike: () => onDisLikeComment(_id, !isHate, index),
              dislikes: hateCount,
              showExpand: replyCount > 0,
              onClickReply: () => handleClickReply(index, -1, item, null, null),
            })}
            author={
              <Link to={`/space?id=${creator?._id}`} target="_blank">
                {creator?.name}
              </Link>
            }
            avatar={
              <Link to={`/space?id=${creator?._id}`} target="_blank">
                <Avatar
                  icon={!creator?.avatar && <UserOutlined />}
                  src={creator?.avatar}
                  alt={creator?.name}
                />
              </Link>
            }
            content={<p>{content}</p>}
            datetime={null}
          >
            {children.map((child, index2) => {
              const { _id, creator, content, targetUser, createTime } = child;
              const isLike =
                replyUserStatus.findIndex(
                  (item) => item.target === _id && item.status === 1,
                ) !== -1;
              const isHate =
                replyUserStatus.findIndex(
                  (item) => item.target === _id && item.status === 2,
                ) !== -1;
              const likeCount = replyStatus[_id]?.like || 0;
              const hateCount = replyStatus[_id]?.disLike || 0;
              return (
                <Comment
                  style={{
                    marginTop: -20,
                  }}
                  key={_id}
                  actions={renderActions({
                    replyText: index2 === targetIndex2 ? '收起' : '回复',
                    viewReplyText: ``,
                    createTime,
                    onLike: () => onLikeReply(_id, !isLike, index, index2),
                    likes: likeCount,
                    isLike,
                    isHate,
                    onDislike: () =>
                      onDisLikeReply(_id, !isHate, index, index2),
                    dislikes: hateCount,
                    showExpand: false,
                    onClickReply: () =>
                      handleClickReply(index, index2, item, creator, child),
                  })}
                  avatar={
                    <Link to={`/space?id=${creator?._id}`} target="_blank">
                      <Avatar
                        icon={!creator?.avatar && <UserOutlined />}
                        src={creator?.avatar}
                        alt={creator?.name}
                      />
                    </Link>
                  }
                  content={
                    <p style={{ fontSize: 14 }}>
                      <Link
                        style={{ marginRight: 10 }}
                        to={`/space?id=${creator?._id}`}
                        target="_blank"
                      >
                        {creator?.name}
                      </Link>
                      {targetUser && (
                        <>
                          <span style={{ marginRight: 10 }}>回复</span>
                          <Link
                            style={{ marginRight: 10 }}
                            to={`/space?id=${targetUser?._id}`}
                            target="_blank"
                          >
                            {targetUser?.name}
                          </Link>
                        </>
                      )}
                      {content}
                    </p>
                  }
                  datetime={null}
                ></Comment>
              );
            })}
            {children.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <Pagination
                  size="small"
                  {...(replyPageParams[_id] || {})}
                  onChange={(page, pageSize) => {
                    fetchReplys(
                      refactorParams({
                        current: page,
                        pageSize,
                        commentId: _id,
                      }),
                    );
                  }}
                />
              </div>
            )}
            {targetIndex === index ? (
              <Editor
                onChange={(e) => {
                  onChangeReply(e.target.value);
                }}
                onSubmit={() => {
                  onSumbitReply(
                    replyValue,
                    targetIndex,
                    targetIndex2,
                    targetComment,
                    targetUser,
                    parentReply,
                  );
                }}
                submitting={replySubmitting}
                value={replyValue}
                placeholder={`回复 ${targetUser?.name || ''}`}
                submitText="回复"
              />
            ) : null}
          </Comment>
        );
      })}
      <div className="more-comments">
        <span
          onClick={() => {
            if (current < totalPage) {
              fetchNextPage(current + 1, pageSize);
            }
          }}
        >
          {total > 0
            ? current < totalPage
              ? '更多评论'
              : '没有更多了'
            : '暂无评论'}
        </span>
      </div>
    </div>
  );
};

export default MyComment;
