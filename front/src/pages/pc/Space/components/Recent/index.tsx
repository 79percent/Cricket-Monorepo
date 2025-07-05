import React, { useCallback, useEffect, useState } from 'react';
import styles from './styles.less';
import { Avatar, Button, Space, Spin } from 'antd';
import { history, connect, Link, SpaceModelState, Dispatch } from 'umi';
import moment from 'moment';
import { UserOutlined, PlusOutlined, StarTwoTone } from '@ant-design/icons';
import Sudoku from '@/components/pc/Sudoku';
import RecentCard from '@/components/pc/RecentCard';
import { getWorkListAPI } from '@/api/works';
import { useScrollEnd } from '@/utils/hooks';

interface Props {
  dispatch: Dispatch;
  space: SpaceModelState;
}

let lastRequestPage = -1;

const Content: React.FC<Props> = ({ dispatch, space }) => {
  const { query } = history.location;
  const { id } = query as { id?: string };
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [pageParams, setPageParams] = useState<{
    current: number;
    pageSize: number;
    total: number;
    totalPage: number;
  }>({
    current: 1,
    pageSize: 6,
    total: 0,
    totalPage: 0,
  });
  const { current, totalPage } = pageParams;

  const fetchData = async (params?: any) => {
    setLoading(true);
    const res = await getWorkListAPI(params);
    setLoading(false);
    return res;
  };

  const handleFetchNext = useCallback(() => {
    if (lastRequestPage === pageParams.current + 1) {
      return;
    }
    if (pageParams.current < pageParams.totalPage) {
      const fetchNext = async () => {
        try {
          lastRequestPage = pageParams.current + 1;
          const res = await fetchData({
            current: pageParams.current + 1,
            pageSize: 6,
            userId: id,
          });
          const { code, current, pageSize, total, totalPage } = res;
          if (code === 0) {
            const { list = [] } = res.data;
            setData([...data, ...list]);
            setPageParams({
              current,
              pageSize,
              total,
              totalPage,
            });
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchNext();
    }
  }, [fetchData, pageParams, data]);

  useEffect(() => {
    const init = async () => {
      const res = await fetchData({
        current: 1,
        pageSize: 6,
        userId: id,
      });
      const {
        code,
        data,
        current: newC,
        pageSize,
        total,
        totalPage: newT,
      } = res;
      if (code === 0) {
        const { list = [] } = data;
        setData(list);
        setPageParams({
          current: newC,
          pageSize,
          total,
          totalPage: newT,
        });
      }
    };
    init();
  }, [id]);

  useScrollEnd(handleFetchNext, 300, 0.6);

  return (
    <div className={styles.tabContent}>
      {data.length > 0
        ? data.map((item) => {
            const { _id } = item;
            return (
              <div key={_id} style={{ marginBottom: 20 }}>
                <RecentCard data={item} />
              </div>
            );
          })
        : !loading && <div className={styles.emptyBox}>暂无动态</div>}
      {loading && (
        <div className={styles.spinBox}>
          <Spin spinning={loading} />
        </div>
      )}
      {!loading && current === totalPage && (
        <div className={styles.spinBox}>
          <span className={styles.last}>没有更多了~</span>
        </div>
      )}
    </div>
  );
};

export default connect(({ space }: { space: SpaceModelState }) => ({
  space,
}))(Content);
