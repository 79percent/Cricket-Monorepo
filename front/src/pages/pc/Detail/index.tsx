import React, { useEffect, FC, useCallback } from 'react';
import {
  connect,
  RecommendModelState,
  DetailModelState,
  ConnectProps,
  Dispatch,
} from 'umi';
import { BackTop } from 'antd';
import styles from './styles.less';
import Left from './components/Left';
import Right from './components/Right';
import RecommendList from '@/components/pc/RecommendList';
import { useScrollEnd } from '@/utils/hooks';

interface Props extends ConnectProps {
  recommend: RecommendModelState;
  detail: DetailModelState;
  dispatch: Dispatch;
}

let lastRequestPage = -1;

const Detail: FC<Props> = ({ detail, location, dispatch, recommend }) => {
  const { query } = location;
  const { id = '' } = query as { id?: string };

  const { recommendList, recommendPageParams, recommendListLoading } =
    recommend;

  // 设置网页标题
  useEffect(() => {
    const { data } = detail;
    const { title } = data || {};
    document.title = `${title || '无题'}`;
  }, [detail]);

  const fetchNextPage = useCallback(() => {
    if (lastRequestPage === recommendPageParams.current + 1) {
      return;
    }
    const getNext = async () => {
      if (recommendPageParams.current < recommendPageParams.totalPage) {
        await dispatch({
          type: 'recommend/saveState',
          payload: {
            recommendListLoading: true,
          },
        });
        lastRequestPage = recommendPageParams.current + 1;
        await dispatch({
          type: 'recommend/fetchNextRecommend',
          payload: {
            current: recommendPageParams.current + 1,
            pageSize: recommendPageParams.pageSize,
            id,
          },
        });
        await dispatch({
          type: 'recommend/saveState',
          payload: {
            recommendListLoading: false,
          },
        });
      }
    };
    getNext();
  }, [recommendPageParams, dispatch]);

  useScrollEnd(fetchNextPage, 300, 0.6);

  useEffect(() => {
    const getData = async () => {
      await dispatch({
        type: 'recommend/saveState',
        payload: {
          recommendListLoading: true,
        },
      });
      await dispatch({
        type: 'recommend/fetchRecommend',
        payload: {
          current: 1,
          pageSize: 12,
          id,
        },
      });
      await dispatch({
        type: 'recommend/saveState',
        payload: {
          recommendListLoading: false,
        },
      });
    };
    getData();
  }, [id]);

  return (
    <>
      <BackTop style={{ right: 40 }} />
      <div className={styles.pcDetail}>
        <Left id={id} />
        <Right id={id} />
      </div>
      <RecommendList
        emptyText="暂无数据"
        data={recommendList}
        loading={recommendListLoading}
        hasMore={recommendPageParams.current < recommendPageParams.totalPage}
        title="推荐作品"
        showFooter={true}
      />
    </>
  );
};

export default connect(
  ({
    detail,
    recommend,
  }: {
    detail: DetailModelState;
    recommend: RecommendModelState;
  }) => ({
    detail,
    recommend,
  }),
)(Detail);
