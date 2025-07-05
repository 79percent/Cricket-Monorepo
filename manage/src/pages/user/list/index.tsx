import { Avatar, Button, Tooltip, Space, message } from 'antd';
import React, { useRef, useState } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getUserListAPI, deleteUserAPI, updateAuthorityAPI } from '@/api/user';
import { UserOutlined } from '@ant-design/icons';
import IconFont from '@/components/IconFont';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);

  const columns: ProColumns<API.UserInfo>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      hideInSearch: true,
      hideInForm: true,
      editable: false,
      width: 80,
      render: (_, row) => {
        const { avatar } = row;
        return <Avatar src={avatar} icon={!avatar && <UserOutlined />} size="large" />;
      },
    },
    {
      title: '用户名',
      dataIndex: 'name',
      hideInForm: true,
      hideInSearch: true,
      editable: false,
      copyable: true,
      width: 120,
      render: (dom) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: '账号',
      dataIndex: 'account',
      width: 120,
      hideInForm: true,
      hideInSearch: true,
      editable: false,
      copyable: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
      hideInForm: true,
      hideInSearch: true,
      editable: false,
      copyable: true,
    },
    {
      title: '权限',
      dataIndex: 'authority',
      width: 120,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '普通用户',
        },
        1: {
          text: '管理员',
        },
        2: {
          text: '系统用户',
        },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '权限为必选项',
          },
        ],
      },
    },
    {
      title: '性别',
      dataIndex: 'sex',
      hideInForm: true,
      hideInSearch: true,
      editable: false,
      width: 100,
      valueEnum: {
        0: {
          text: '保密',
        },
        1: {
          text: '男',
        },
        2: {
          text: '女',
        },
      },
    },
    {
      title: '简介',
      dataIndex: 'profile',
      width: 200,
      hideInSearch: true,
      hideInForm: true,
      editable: false,
      ellipsis: true,
    },
    {
      title: '生日',
      dataIndex: 'birthDay',
      sorter: true,
      width: 200,
      valueType: 'dateTime',
      hideInSearch: true,
      editable: false,
      hideInForm: true,
    },
    {
      title: '上一次登录',
      dataIndex: 'lastLoginTime',
      sorter: true,
      valueType: 'dateTime',
      width: 200,
      hideInSearch: true,
      hideInForm: true,
      editable: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
      editable: false,
      width: 200,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      sorter: true,
      width: 200,
      valueType: 'dateTime',
      hideInSearch: true,
      editable: false,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 140,
      fixed: 'right',
      render: (text, record, _, action) => {
        return (
          <Space>
            <Tooltip title="编辑">
              <IconFont
                type="icon-bianji1"
                style={{ fontSize: 22, color: 'rgb(40, 166, 255)' }}
                onClick={() => {
                  action?.startEditable?.(record._id);
                }}
              />
            </Tooltip>
            {/* <Tooltip title="删除">
              <IconFont
                type="icon-shanchu3"
                style={{ fontSize: 22, color: '#ff5959' }}
                onClick={async () => {
                  try {
                    const res = await deleteUserAPI({
                      id: record?._id,
                    });
                    if (res?.code === 0) {
                      message.success(res?.message || '删除成功');
                      actionRef.current?.reload();
                    } else {
                      message.error(res?.message || '删除失败');
                    }
                  } catch (error) {}
                }}
              />
            </Tooltip> */}
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="_id"
        editable={{
          onDelete: async (id) => {
            try {
              const res = await deleteUserAPI({
                id,
              });
              if (res?.code === 0) {
                message.success(res?.message || '删除成功');
                actionRef.current?.reload();
              } else {
                message.error(res?.message || '删除失败');
              }
            } catch (error) {}
          },
          onSave: async (userId, newRow) => {
            try {
              const { authority } = newRow;
              const res = await updateAuthorityAPI({
                id: userId as string,
                authority: authority,
              });
              if (res?.code === 0) {
                message.success(res?.message || '权限修改成功');
                actionRef.current?.reload();
              } else {
                message.error(res?.message);
              }
            } catch (error) {}
          },
        }}
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
          return getUserListAPI({
            ...params,
            ...sort,
            ...filter,
          });
        }}
        columns={columns}
        scroll={{ x: 1300 }}
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
