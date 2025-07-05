import React, { useState, useEffect } from 'react';
import styles from './Illustrations.less';
import RecommendList from '@/components/pc/RecommendList';
import { connect, Dispatch, SpaceModelState, history } from 'umi';
import { bounceAnime, getElementToPageTop } from '@/utils';
import { getWorkListAPI } from '@/api/works';

interface Props {
  dispatch: Dispatch;
  space: SpaceModelState;
}

interface CheckAllProps {
  onClick?: () => void;
}

/**
 * 查看全部按钮组件
 */
const CheckAll: React.FC<CheckAllProps> = ({ onClick }) => {
  return (
    <div className={styles.checkAllButton} onClick={onClick}>
      查看全部
    </div>
  );
};

/**
 * 插画
 */
const Illustrations: React.FC<Props> = ({ space, dispatch }) => {
  const { query } = history.location;
  const { id } = query as { id?: string };
  const [data, setData] = useState<any[]>([]);

  const fetchData = async (params?: any) => {
    const res = await getWorkListAPI(params);
    return res;
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    const init = async () => {
      const res = await fetchData({
        current: 1,
        pageSize: 12,
        userId: id,
      });
      if (res?.code === 0) {
        setData(res?.data?.list || []);
      }
    };
    init();
  }, [id]);

  return (
    <div>
      <RecommendList
        emptyText="暂无投稿"
        data={data}
        loading={false}
        hasMore={false}
        title="插画"
        showFooter={false}
        showCreator={false}
      />
      {data.length > 0 && (
        <div className={styles.checkAllRow}>
          <CheckAll
            onClick={async () => {
              await dispatch({
                type: 'space/saveState',
                payload: {
                  tabActive: '3',
                },
              });
              const tabsElement = document.querySelector(
                '#pc-space-tabs-box',
              ) as HTMLDivElement;
              const top = getElementToPageTop(tabsElement);
              bounceAnime(top);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default connect(({ space }: { space: SpaceModelState }) => ({
  space,
}))(Illustrations);
