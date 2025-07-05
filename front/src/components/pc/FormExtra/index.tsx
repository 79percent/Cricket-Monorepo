import React, { Component } from 'react';

/**
 * 表单元素下方额外内容
 * 可展示输入框输入的长度
 * @param props
 */
const Extra = (props) => {
  const { left, right } = props;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'rgba(0, 0, 0, 0.45)',
        fontSize: 12,
      }}
    >
      {left}
      {right}
    </div>
  );
};
export default Extra;
