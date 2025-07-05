import React from 'react';
import Left from './components/Left';
import Right from './components/Right';
import PageCard from '@/components/pc/PageCard';

const Setting = () => {
  return (
    <PageCard
      title="个人设置"
      contentStyle={{
        display: 'flex',
      }}
    >
      <Left />
      <Right />
    </PageCard>
  );
};

export default Setting;
