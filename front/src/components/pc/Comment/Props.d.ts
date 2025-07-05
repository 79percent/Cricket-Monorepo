export interface Props {
  commentSubmitting: boolean;
  commentValue: string;
  replyValue: string;
  replySubmitting: boolean;
  userInfo: any;
  comments: any[];
  commentReplyCount: any;
  commentStatus: any;
  commentUserStatus: any[];
  commentsPageParams: any;
  replys: any;
  replyStatus: any;
  replyUserStatus: any[];
  replyPageParams: any;
  onChangeComment: (value: string) => void;
  onSumbitComment: (value: string) => void;
  onLikeComment: (id: string, status: boolean, index: number) => void;
  onDisLikeComment: (id: string, status: boolean, index: number) => void;
  onChangeReply: (value: string) => void;
  onSumbitReply: (
    value: string,
    index: number,
    index2: number,
    comment: any,
    targetUser: any,
    parentReply: any,
  ) => void;
  onLikeReply: (
    id: string,
    status: boolean,
    index: number,
    index2: number,
  ) => void;
  onDisLikeReply: (
    id: string,
    status: boolean,
    index: number,
    index2: number,
  ) => void;
  fetchReplys: (params: any) => void;
  refactorParams: (params: any) => any;
  fetchNextPage: (current: number, pageSize: number) => void;
}
