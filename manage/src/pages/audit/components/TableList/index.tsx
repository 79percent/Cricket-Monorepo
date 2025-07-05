import React, { useState, useRef } from 'react';
import { Button, message, Avatar, Tooltip, Popconfirm, Tag } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem, TableListPagination } from './data';
import { auditWorkAPI, deleteWorkAPI, getWorkListAPI } from '@/api/works';
import TableImage from '@/components/TableImage';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import UnPassModal from '@/components/UnPassModal';
import IconFont from '@/components/IconFont';
import { colorList } from '@/utils/theme';

interface Props {
  apiParmas: any;
  title: string;
  hidePass?: boolean;
  hideUnPass?: boolean;
  hideDelete?: boolean;
}

const TableList: React.FC<Props> = ({
  apiParmas,
  title: headerTitle,
  hideDelete,
  hidePass,
  hideUnPass,
}) => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const [modalRowState, setModalRowState] = useState<TableListItem | TableListItem[] | undefined>(
    undefined,
  );
  const [visible, setVisible] = useState(false);

  /**
   * 审核通过
   */
  const handleAuditPass = async (id: string | string[]) => {
    const res = await auditWorkAPI({
      id,
      status: '1',
    });
    if (res?.code === 0) {
      message.success(res?.message || '操作成功');
      actionRef.current?.reload();
    }
    return res;
  };

  /**
   * 审核未通过
   */
  const handleAuditUnPass = async (id: string | string[], reason: string) => {
    const res = await auditWorkAPI({
      id,
      status: '2',
      reason,
    });
    if (res?.code === 0) {
      message.success(res?.message || '操作成功');
      actionRef.current?.reload();
    }
    return res;
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      hideInSearch: true,
      width: 100,
    },
    {
      width: 150,
      title: '内容',
      dataIndex: 'content',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      width: 200,
      title: '标签',
      dataIndex: 'tags',
      hideInSearch: true,
      render: (_, record) => {
        const { tags } = record;
        return tags.map((tag, index) => {
          return (
            <Tooltip key={tag} title={tag}>
              <Tag
                color={colorList[index % colorList.length]}
                style={{ padding: '4px 10px', marginTop: 8, whiteSpace: 'normal' }}
              >
                {tag}
              </Tag>
            </Tooltip>
          );
        });
      },
    },
    {
      width: 200,
      title: '图片',
      dataIndex: 'imgs',
      hideInSearch: true,
      render: (_, record) => {
        const { imgs, title, content } = record;
        return <TableImage data={imgs} width={60} height={60} alt={content || title} />;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      width: 120,
      valueEnum: {
        0: {
          text: '待审核',
          status: 'Processing',
        },
        1: {
          text: '审核通过',
          status: 'Success',
        },
        2: {
          text: '审核未通过',
          status: 'Error',
        },
      },
    },
    {
      width: 160,
      title: '原因',
      dataIndex: 'reason',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      width: 140,
      title: '投稿人',
      hideInSearch: true,
      dataIndex: 'creator',
      render: (_, record) => {
        const { creator } = record as any;
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size="small" src={creator?.avatarMin} alt="avatar" />
            <span style={{ marginLeft: 10 }}>{creator?.name}</span>
          </div>
        );
      },
    },
    {
      title: '创建时间',
      sorter: true,
      hideInSearch: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 120,
      render: (_, record) => [
        hidePass ? null : (
          <Tooltip key="yes" title="审核通过">
            <CheckCircleOutlined
              style={{ fontSize: 22, color: '#9932CC' }}
              onClick={() => handleAuditPass(record?._id)}
            />
          </Tooltip>
        ),
        hideUnPass ? null : (
          <Tooltip key="no" title="审核未通过">
            <CloseCircleOutlined
              style={{ fontSize: 22, color: '#ff5959' }}
              onClick={() => {
                setModalRowState(record);
                setVisible(true);
              }}
            />
          </Tooltip>
        ),
        hideDelete ? null : (
          <Popconfirm
            key="delete"
            cancelText="取消"
            okText="删除"
            title="确定要删除这一条？"
            onConfirm={async () => {
              try {
                const res = await deleteWorkAPI({
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
          >
            <Tooltip title="删除">
              <IconFont type="icon-shanchu3" style={{ fontSize: 22, color: '#ff5959' }} />
            </Tooltip>
          </Popconfirm>
        ),
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle={headerTitle}
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
        }}
        pagination={{
          size: 'default',
        }}
        scroll={{ x: 1300 }}
        request={(params, sort, filter) =>
          getWorkListAPI({
            ...params,
            ...sort,
            ...filter,
            ...apiParmas,
          }).then((res) => {
            const { data, total } = res;
            return {
              total,
              data: data.list,
              success: true,
            };
          })
        }
        columns={columns}
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
          {hidePass ? null : (
            <Button
              type="primary"
              onClick={async () => {
                await handleAuditPass(selectedRowsState.map((item) => item._id));
                setSelectedRows([]);
              }}
            >
              批量通过
            </Button>
          )}
          {hideUnPass ? null : (
            <Button
              type="primary"
              danger
              onClick={async () => {
                setModalRowState(selectedRowsState);
                setVisible(true);
              }}
            >
              批量未通过
            </Button>
          )}
        </FooterToolbar>
      )}
      <UnPassModal
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={async (value) => {
          if (modalRowState) {
            const res = await handleAuditUnPass(
              Array.isArray(modalRowState)
                ? modalRowState.map((item) => item._id)
                : modalRowState?._id,
              value as string,
            );
            if (res?.code === 0) {
              setVisible(false);
              setSelectedRows([]);
              setModalRowState(undefined);
            }
          }
        }}
      />
    </PageContainer>
  );
};

export default TableList;
