import React, { useEffect } from 'react';
import {
  connect,
  DetailModelState,
  LoginModelState,
  HeaderModelState,
} from 'umi';
import styles from './styles.less';
import Content from './Content';
import Tags from './Tags';
import ImgBox from './ImgBox';
import OperationStatistics from './OperationStatistics';

interface Props {
  id: string;
  dispatch: (params: any) => void;
  detail: DetailModelState;
  header: HeaderModelState;
  login: LoginModelState;
}

const Left = (props: Props) => {
  const { id, dispatch } = props;

  useEffect(() => {
    dispatch({
      type: 'detail/fetchDetail',
      payload: {
        id,
      },
    });
  }, [id]);

  return (
    <div className={styles.left}>
      <div className={styles.box}>
        {/* 图片 */}
        <ImgBox />
        {/* 点赞、评论、收藏数量 */}
        <OperationStatistics id={id} />
        {/* 内容 */}
        <Content />
        {/* 标签 */}
        <Tags />
      </div>
      {/* 评论 */}
      {/* <CommentBox id={id} /> */}
    </div>
  );
};

export default connect(
  ({
    detail,
    header,
    login,
  }: {
    detail: DetailModelState;
    header: HeaderModelState;
    login: LoginModelState;
  }) => ({
    detail,
    header,
    login,
  }),
)(Left);
