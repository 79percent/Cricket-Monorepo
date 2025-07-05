/**
 * 投稿管理
 */
import React, { useState } from 'react';
import { Radio, Tabs } from 'antd';
import All from './components/All';
import Pass from './components/Pass';
import UnPass from './components/UnPass';
import Wait from './components/Wait';

const { TabPane } = Tabs;

const PublishManage = () => {
  const [radioValue, setRadioValue] = useState('all');
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Radio.Group
          value={radioValue}
          onChange={(e) => {
            setRadioValue(e.target.value);
          }}
          size="large"
        >
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="0">待审核</Radio.Button>
          <Radio.Button value="1">已通过</Radio.Button>
          <Radio.Button value="2">未通过</Radio.Button>
        </Radio.Group>
      </div>
      <Tabs activeKey={radioValue} tabBarStyle={{ height: 0 }}>
        <TabPane key="all">
          <All />
        </TabPane>
        <TabPane key="0">
          <Wait></Wait>
        </TabPane>
        <TabPane key="1">
          <Pass></Pass>
        </TabPane>
        <TabPane key="2">
          <UnPass></UnPass>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PublishManage;
