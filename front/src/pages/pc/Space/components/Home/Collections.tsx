import React, { useState, useEffect } from 'react';
import styles from './Collections.less';
import Title from '@/components/pc/Title';
import { RightOutlined } from '@ant-design/icons';
import IconFont from '@/components/pc/IconFont';
import guoqi from '@/assets/icon/D-tupianguoqi1.svg';
import { getFavoritesListIllustrationsAPI } from '@/api/favorites';
import { connect, SpaceModelState, Dispatch, history } from 'umi';
import { bounceAnime, getElementToPageTop } from '@/utils';

interface Props {
  dispatch: Dispatch;
  space: SpaceModelState;
}

/**
 * 收藏
 */
const Collections: React.FC<Props> = ({ dispatch, space }) => {
  const [data, setData] = useState<any[]>([]);
  const { query } = history.location;
  const { id } = query as { id?: string };

  const fetchData = async (params?: any) => {
    const res = await getFavoritesListIllustrationsAPI(params);
    return res;
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    const init = async () => {
      const res = await fetchData({
        current: 1,
        pageSize: 6,
        id,
      });
      if (res?.code === 0) {
        setData(res?.data || []);
      }
    };
    init();
  }, [id]);

  return (
    <div>
      <Title
        title="他的收藏夹"
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
                  tabActive: '4',
                },
              });
              const tabsElement = document.querySelector(
                '#pc-space-tabs-box',
              ) as HTMLDivElement;
              const top = getElementToPageTop(tabsElement);
              bounceAnime(top);
            }}
          >
            更多
            <RightOutlined />
          </div>
        }
      />
      {data.length > 0 ? (
        <div className={styles.collections}>
          {data.map((item) => {
            const { _id, works = [], title, content } = item;
            const count = works.length;
            const { work = {} } = works[0] || {};
            const { imgs = [] } = work;
            const { urlMin = '' } = imgs[0] || {};
            return (
              <div key={_id} className={styles.collectionsItem}>
                <div
                  className={styles.collectionsItemImg}
                  onClick={async () => {
                    await dispatch({
                      type: 'collection/saveState',
                      payload: {
                        favoritesKey: [_id],
                      },
                    });
                    await dispatch({
                      type: 'space/saveState',
                      payload: {
                        tabActive: '4',
                      },
                    });
                    const tabsElement = document.querySelector(
                      '#pc-space-tabs-box',
                    ) as HTMLDivElement;
                    const top = getElementToPageTop(tabsElement);
                    bounceAnime(top);
                  }}
                >
                  <img
                    src={urlMin}
                    alt={content}
                    className={styles.img}
                    onError={(e) => {
                      // @ts-ignore
                      e.target.src = guoqi;
                    }}
                  />
                  <div className={styles.num}>
                    <IconFont
                      type="icon-jihe"
                      style={{ fontSize: 18, color: '#fff' }}
                      className={styles.numIcon}
                    />
                    <div className={styles.numText}>{count}</div>
                  </div>
                </div>
                <div className={styles.collectionsItemTitle}>
                  <span
                    onClick={async () => {
                      await dispatch({
                        type: 'collection/saveState',
                        payload: {
                          favoritesKey: [_id],
                        },
                      });
                      await dispatch({
                        type: 'space/saveState',
                        payload: {
                          tabActive: '4',
                        },
                      });
                      const tabsElement = document.querySelector(
                        '#pc-space-tabs-box',
                      ) as HTMLDivElement;
                      const top = getElementToPageTop(tabsElement);
                      bounceAnime(top);
                    }}
                  >
                    {title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyBox}>还没有创建收藏夹</div>
      )}
    </div>
  );
};

export default connect(({ space }: { space: SpaceModelState }) => ({
  space,
}))(Collections);
