import React, { useState, useEffect } from 'react';
import styles from './Recent.less';
import Title from '@/components/pc/Title';
import { RightOutlined } from '@ant-design/icons';
import RecentCard from '@/components/pc/RecentCard';
import { connect, Dispatch, SpaceModelState, history } from 'umi';
import { bounceAnime, getElementToPageTop } from '@/utils';
import { getWorkListAPI } from '@/api/works';

interface Props {
  dispatch: Dispatch;
  space: SpaceModelState;
}

/**
 * 最新动态
 */
const Recent: React.FC<Props> = ({ dispatch, space }) => {
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
        pageSize: 1,
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
      <Title
        title="最新动态"
        style={{
          marginTop: 20,
        }}
        right={
          <div
            className={styles.more}
            onClick={async () => {
              await dispatch({
                type: 'space/saveState',
                payload: {
                  tabActive: '2',
                },
              });
              const tabsElement = document.querySelector(
                '#pc-space-tabs-box',
              ) as HTMLDivElement;
              const top = getElementToPageTop(tabsElement);
              bounceAnime(top);
            }}
          >
            所有
            <RightOutlined />
          </div>
        }
      />
      {data.length === 0 ? (
        <div className={styles.emptyBox}>暂无动态</div>
      ) : (
        data.map((item) => {
          const { _id } = item;
          return <RecentCard key={_id} data={item} />;
        })
      )}
    </div>
  );
};

export default connect(({ space }: { space: SpaceModelState }) => ({
  space,
}))(Recent);
