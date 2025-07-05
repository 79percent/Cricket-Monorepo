import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import {
  connect,
  SpaceModelState,
  LoginModelState,
  Dispatch,
  history,
} from 'umi';
import {
  HeartOutlined,
  HomeOutlined,
  PictureOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import styles from './styles.less';
import Statistics from '../Statistics';
import TabItem from '@/components/pc/TabItem';
import Collections from '../Collections';
import Home from '../Home';
import Recent from '../Recent';
import Contribute from '../Contribute';
import Attentions from '../Attentions';
import Fans from '../Fans';
import { bounceAnime, getElementToPageTop } from '@/utils';

const { TabPane } = Tabs;

interface Props {
  space: SpaceModelState;
  login: LoginModelState;
  dispatch: Dispatch;
}

const SpaceTabs: React.FC<Props> = ({ space, dispatch }) => {
  const { statistics, tabActive } = space;
  const { location } = history;
  const { query } = location;
  const { id } = query as { id?: string };

  useEffect(() => {
    if (!id) {
      return;
    }
    dispatch({
      type: 'space/fetchUserStatisticsAPI',
      payload: {
        id,
      },
    });
    dispatch({
      type: 'space/saveState',
      payload: {
        tabActive: '1',
      },
    });
  }, [id]);

  const tabBarExtraContent = (
    <Statistics
      onClick={(key) => {
        dispatch({
          type: 'space/saveState',
          payload: {
            tabActive: key,
          },
        });
        const tabsElement = document.querySelector(
          '#pc-space-tabs-box',
        ) as HTMLDivElement;
        const top = getElementToPageTop(tabsElement);
        bounceAnime(top);
      }}
      data={[
        {
          key: '3',
          label: '投稿数',
          value: statistics['contributeCount'],
        },
        {
          key: '5',
          label: '关注数',
          value: statistics['attentionCount'],
        },
        {
          key: '6',
          label: '粉丝数',
          value: statistics['fansCount'],
        },
      ]}
    />
  );

  return (
    <div className={styles.tabBox} id="pc-space-tabs-box">
      <Tabs
        tabBarExtraContent={tabBarExtraContent}
        activeKey={tabActive}
        onChange={(key) => {
          dispatch({
            type: 'space/saveState',
            payload: {
              tabActive: key,
            },
          });
        }}
      >
        <TabPane
          style={{ minHeight: 400, marginBottom: 200 }}
          tab={
            <TabItem
              icon={
                <HomeOutlined
                  style={{
                    fontSize: 18,
                  }}
                />
              }
              text="主页"
            />
          }
          key="1"
        >
          <Home />
        </TabPane>
        <TabPane
          style={{ minHeight: 400, marginBottom: 200 }}
          tab={
            <TabItem
              icon={
                <CrownOutlined
                  style={{
                    fontSize: 18,
                  }}
                />
              }
              text="动态"
            />
          }
          key="2"
        >
          <Recent />
        </TabPane>
        <TabPane
          style={{ minHeight: 400, marginBottom: 200 }}
          tab={
            <TabItem
              icon={
                <PictureOutlined
                  style={{
                    fontSize: 18,
                  }}
                />
              }
              text="插画"
            />
          }
          key="3"
        >
          <Contribute />
        </TabPane>
        <TabPane
          style={{ minHeight: 400, marginBottom: 200 }}
          tab={
            <TabItem
              icon={
                <HeartOutlined
                  style={{
                    fontSize: 18,
                  }}
                />
              }
              text="收藏"
            />
          }
          key="4"
        >
          <Collections />
        </TabPane>
      </Tabs>
      {tabActive === '5' && <Attentions />}
      {tabActive === '6' && <Fans />}
    </div>
  );
};

export default connect(
  ({ space, login }: { space: SpaceModelState; login: LoginModelState }) => ({
    space,
    login,
  }),
)(SpaceTabs);
