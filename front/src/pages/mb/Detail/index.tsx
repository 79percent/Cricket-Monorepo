/**
 * 移动端 图片详情页
 */
import React, { useEffect, FC, useCallback, useState } from 'react';
import {
  connect,
  RecommendModelState,
  DetailModelState,
  ConnectProps,
  Dispatch,
} from 'umi';
import { BackTop } from 'tdesign-mobile-react';
import styles from './styles.less';
import { useScrollEnd } from '@/utils/hooks';
import { Image } from 'antd';
import guoqi from '@/assets/icon/D-tupianguoqi1.svg';
import './index.less';
import ImageProgressive from '@/components/pc/ImageProgressive';
import OperationStatistics from './components/OperationStatistics';
import Content from './components/Content';
import Skeleton from '@/components/mb/Skeleton';
import User from './User';
import Recommend from './components/Recommend';

interface Props extends ConnectProps {
  recommend: RecommendModelState;
  detail: DetailModelState;
  dispatch: Dispatch;
}

let lastRequestPage = -1;

const Detail: FC<Props> = ({ detail, location, dispatch, recommend }) => {
  const { query } = location;
  const { id = '' } = query as { id?: string };
  const { data = {} } = detail || {};
  const { imgs = [] } = data;
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewCurrent, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  const { recommendList, recommendPageParams, recommendListLoading } =
    recommend;

  // 设置网页标题
  useEffect(() => {
    const { title } = data || {};
    document.title = `${title || '无题'}`;
  }, [data]);

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
    setLoading(true);
    dispatch({
      type: 'detail/fetchDetail',
      payload: {
        id,
      },
    }).finally(() => {
      setLoading(false);
    });
  }, [id]);

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
          pageSize: 5,
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
      <BackTop theme="round-dark" style={{ backgroundColor: '#0000009e' }} />
      <div className={styles.mbDetail}>
        <div className={styles.mbDetailImgBox}>
          <div className={styles.mbDetailImg} id="mbDetailImg">
            {imgs.map((item, index) => {
              const { _id, url, urlMin } = item;
              return (
                <ImageProgressive
                  key={_id}
                  preview={{ visible: false }}
                  onClick={() => {
                    setPreviewVisible(true);
                    setCurrent(index);
                  }}
                  src={url}
                  minUrl={urlMin}
                  fallback={guoqi}
                />
              );
            })}
          </div>
          <Content />
          <OperationStatistics id={id} />
        </div>
        <User />
        <Recommend />
      </div>
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible: previewVisible,
            onVisibleChange: (vis) => setPreviewVisible(vis),
            current: previewCurrent,
          }}
        >
          {imgs.map((item) => {
            const { url, _id } = item;
            return <Image key={_id} src={url} />;
          })}
        </Image.PreviewGroup>
      </div>
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
