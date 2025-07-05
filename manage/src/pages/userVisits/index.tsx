import { Button } from 'antd';
import React, { useRef, useState } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getBuriedPointAPI } from '@/api/buriedPoint';
import type { BuriedPoint } from './data';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);

  const columns: ProColumns<BuriedPoint>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
    },
    {
      title: '设备信息',
      dataIndex: 'device',
      sorter: true,
      hideInSearch: true,
      editable: false,
      hideInForm: true,
      width: 180,
      render: (_) => {
        return <p style={{ whiteSpace: 'pre-line' }}>{_}</p>;
      },
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      hideInForm: true,
      hideInSearch: true,
      editable: false,
      copyable: true,
      ellipsis: true,
      width: 120,
      render: (dom) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '归属地',
      dataIndex: 'location',
      hideInForm: true,
      hideInSearch: true,
      editable: false,
      copyable: true,
      ellipsis: true,
      width: 180,
      render: (dom) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '加载时间',
      dataIndex: 'loadTime',
      hideInForm: true,
      hideInSearch: true,
      editable: false,
      ellipsis: true,
      width: 100,
      renderText: (_) => {
        return _ ? `${Number(_) / 1000}秒` : '-';
      },
    },
    {
      title: '请求地址',
      dataIndex: 'referer',
      hideInSearch: true,
      width: 160,
      hideInForm: true,
      editable: false,
      ellipsis: true,
      copyable: true,
    },
    {
      title: '目标地址',
      dataIndex: 'host',
      hideInForm: true,
      hideInSearch: true,
      editable: false,
      width: 160,
      ellipsis: true,
      copyable: true,
    },

    {
      title: '分辨率',
      dataIndex: 'resolution',
      sorter: true,
      hideInSearch: true,
      editable: false,
      hideInForm: true,
      width: 100,
    },
    {
      title: '请求时间',
      dataIndex: 'createTime',
      sorter: true,
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
      editable: false,
      width: 140,
      fixed: 'right',
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle="用户访问量"
        actionRef={actionRef}
        rowKey="_id"
        pagination={{
          size: 'default',
        }}
        request={(
          params: {
            pageSize: number;
            current: number;
          },
          sort,
          filter,
        ) => {
          return getBuriedPointAPI({
            ...params,
            ...sort,
            ...filter,
          });
        }}
        columns={columns}
        scroll={{ x: 1600 }}
        rowSelection={{
          selectedRowKeys: selectedRowsState.map((item) => item._id),
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择
              <a
                style={{
                  fontWeight: 600,
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                {selectedRowsState.length}
              </a>
              项
            </div>
          }
        >
          <Button type="primary" danger onClick={async () => {}}>
            批量删除
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default TableList;
