import React, { useEffect, useState } from 'react';
import {
  connect,
  ContributeModelState,
  LoginModelState,
  Dispatch,
  history,
} from 'umi';
import RecommendList from '@/components/pc/RecommendList';
import Pagination from '@/components/pc/Pagination';
import { bounceAnime, getElementToPageTop } from '@/utils';
import { getWorkListAPI } from '@/api/works';
import styles from './styles.less';

interface Props {
  contribute: ContributeModelState;
  login: LoginModelState;
  dispatch: Dispatch;
}

const Content: React.FC<Props> = ({ dispatch, contribute, login }) => {
  const { query } = history.location;
  const { id } = query as { id?: string };
  const [data, setData] = useState<any[]>([]);
  const [pageParams, setPageParams] = useState<any>({
    current: 1,
    pageSize: 36,
    total: 0,
    totalPage: 0,
  });
  const { current, pageSize, total } = pageParams;

  const fetchData = async (params?: any) => {
    const res = await getWorkListAPI(params);
    if (res?.code === 0) {
      const { current = 1, pageSize = 30, total = 0, totalPage = 0 } = res;
      setData(res?.data?.list || []);
      setPageParams({
        current,
        pageSize,
        total,
        totalPage,
      });
    }
    return res;
  };

  const handleChangePage = async (current) => {
    await fetchData({
      current,
      pageSize: 36,
      userId: id,
      statistics: '0',
    });
  };

  useEffect(() => {
    const init = async () => {
      await fetchData({
        current: 1,
        pageSize: 36,
        userId: id,
        statistics: '0',
      });
    };
    init();
  }, [id]);

  return (
    <div className={styles.tabContent}>
      <RecommendList
        emptyText="暂无投稿"
        data={data}
        loading={false}
        hasMore={false}
        showFooter={false}
        showCreator={false}
      />
      {pageParams.total > 0 && (
        <Pagination
          style={{
            marginTop: 20,
          }}
          current={current}
          pageSize={pageSize}
          total={total}
          onClick={async (index) => {
            await handleChangePage(index);
            const tabsElement = document.querySelector(
              '#pc-space-tabs-box',
            ) as HTMLDivElement;
            const top = getElementToPageTop(tabsElement);
            bounceAnime(top);
          }}
        />
      )}
    </div>
  );
};

export default connect(
  ({
    contribute,
    login,
  }: {
    contribute: ContributeModelState;
    login: LoginModelState;
  }) => ({
    contribute,
    login,
  }),
)(Content);
