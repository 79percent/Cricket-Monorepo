import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  List,
  Tooltip,
  Card,
  Tag,
  Image,
  message,
  Space,
  Popconfirm,
  Modal,
  Form,
} from 'antd';
import {
  UpCircleOutlined,
  DownCircleOutlined,
  RedoOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import styles from './styles.less';
import { getWorkListAPI, deleteWorkAPI, deleteWorkItemAPI } from '@/api/works';
import TableImage from '@/components/pc/TableImage';
import { colorList } from '@/utils/theme';
import moment from 'moment';
import IconFont from '@/components/pc/IconFont';
import guoqi from '@/assets/icon/D-tupianguoqi1.svg';

const { confirm } = Modal;

interface Props {
  apiParams: any;
  title?: string;
}

const TableList: React.FC<Props> = ({ apiParams, title }) => {
  const [form] = Form.useForm();
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [editingKey, setEditingKey] = useState('');
  const [pageParams, setPageParams] = useState<any>({
    current: 1,
    pageSize: 5,
    total: 0,
    totalPage: 0,
  });

  const isEditing = (record: any) => record._id === editingKey;

  const edit = (record: any) => {
    // form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  /**
   * 获取数据
   * @param params
   */
  const fetchData = async (params) => {
    try {
      setLoading(true);
      const res = await getWorkListAPI({
        ...params,
        ...apiParams,
      });
      if (res?.code === 0) {
        setData(res?.data?.list);
        setPageParams({
          current: res?.current,
          pageSize: res?.pageSize,
          total: res?.total,
          totalPage: res?.totalPage,
        });
      }
      setLoading(false);
    } catch (error) {}
  };

  /**
   * 批量删除提示弹窗
   */
  const showDeleteConfirm = () => {
    confirm({
      title: '确定要删除选中项？',
      icon: <ExclamationCircleOutlined />,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteWorkAPI({
            id: selectedRowsState.map((item) => item._id),
          });
          if (res?.code === 0) {
            message.success(res?.message);
            fetchData({
              current: pageParams.current,
              pageSize: pageParams.pageSize,
            });
          } else {
            message.error(res?.message || '删除失败');
          }
        } catch (error) {
          message.error('删除失败');
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  useEffect(() => {
    fetchData({
      current: 1,
      pageSize: 5,
    });
  }, []);

  const columns = [
    {
      width: 60,
      title: '操作',
      key: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Popconfirm
              cancelText="取消"
              okText="保存"
              title="确定要保存这次更改？"
              onConfirm={async () => {}}
            >
              <Tooltip title="保存">
                <IconFont
                  type="icon-baocun2"
                  style={{ fontSize: 22, color: 'rgb(2, 127, 255)' }}
                />
              </Tooltip>
            </Popconfirm>
            <Popconfirm
              cancelText="取消"
              okText="放弃"
              title="确定要放弃这次更改？"
              onConfirm={cancel}
            >
              <Tooltip title="撤销">
                <IconFont
                  type="icon-weibiaoti545"
                  style={{ fontSize: 22, color: 'rgb(122, 122, 122)' }}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            {/* <Tooltip title="编辑">
              <IconFont
                type="icon-bianji1"
                style={{ fontSize: 22, color: 'rgb(40, 166, 255)' }}
                onClick={() => edit(record)}
              />
            </Tooltip> */}
            <Popconfirm
              cancelText="取消"
              okText="删除"
              title="确定要删除这一条？"
              onConfirm={async () => {
                try {
                  const res = await deleteWorkAPI({
                    id: record?._id,
                  });
                  if (res?.code === 0) {
                    message.success(res?.message);
                    fetchData({
                      current: pageParams.current,
                      pageSize: pageParams.pageSize,
                    });
                  } else {
                    message.error(res?.message || '删除失败');
                  }
                } catch (error) {
                  message.error('删除失败');
                }
              }}
            >
              <Tooltip title="删除">
                <IconFont
                  type="icon-shanchu3"
                  style={{ fontSize: 22, color: '#ff5959' }}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
    {
      width: 60,
      title: '序号',
      dataIndex: 'index',
      render: (text, record, index) => {
        return (pageParams.current - 1) * pageParams.pageSize + index + 1;
      },
    },
    {
      width: 180,
      title: '图片',
      dataIndex: 'name',
      render: (_, record) => {
        const { imgs, title, content } = record;
        return (
          <TableImage
            data={imgs}
            width={60}
            height={60}
            alt={content || title}
          />
        );
      },
    },
    {
      width: 120,
      title: '标题',
      dataIndex: 'title',
      editable: true,
      ellipsis: true,
      render: (_, record) => {
        return _ ? _ : '-';
      },
    },
    {
      width: 220,
      title: '内容',
      dataIndex: 'content',
      editable: true,
      ellipsis: true,
      render: (_, record) => {
        return _ ? _ : '-';
      },
    },
    {
      width: 220,
      title: '标签',
      dataIndex: 'tags',
      editable: true,
      render: (tags, record) => {
        return tags.map((tag, index) => {
          return (
            <Tooltip key={tag} title={tag}>
              <Tag
                color={colorList[index % colorList.length]}
                style={{
                  padding: '4px 10px',
                  marginTop: 8,
                  whiteSpace: 'normal',
                }}
              >
                {tag}
              </Tag>
            </Tooltip>
          );
        });
      },
    },
    {
      width: 150,
      title: '审核状态',
      dataIndex: 'status',
      render: (status, record) => {
        const colorMap = {
          '0': 'blue',
          '1': 'green',
          '2': 'red',
        };
        const textMap = {
          '0': '待审核',
          '1': '通过',
          '2': '未通过',
        };
        return (
          <Tag
            color={colorMap[status]}
            style={{ padding: '4px 10px', marginTop: 8 }}
          >
            {textMap[status]}
          </Tag>
        );
      },
    },
    {
      width: 150,
      title: '原因',
      dataIndex: 'reason',
      ellipsis: true,
      render: (_, record) => {
        return _ ? _ : '-';
      },
    },
    {
      width: 200,
      title: '上传时间',
      dataIndex: 'createTime',
      sorter: true,
      render: (_) => {
        return <span>{moment(_).format('YYYY-MM-DD hh:mm:ss')}</span>;
      },
    },
  ];

  return (
    <Card
      style={{ padding: '0 0 20px 0', borderRadius: 8 }}
      bodyStyle={{ padding: '0 16px' }}
    >
      <Table
        rowKey="_id"
        loading={loading}
        title={() => (
          <div className={styles.title}>
            <div className={styles.titleLeft}>{title}</div>
            <div className={styles.titleRight}>
              <Space>
                {selectedRowsState.length > 0 && (
                  <Button danger type="primary" onClick={showDeleteConfirm}>
                    删除选中的 {selectedRowsState.length} 项
                  </Button>
                )}
                <Tooltip title="刷新">
                  <RedoOutlined
                    style={{ fontSize: 20 }}
                    onClick={() => {
                      fetchData({
                        current: pageParams.current,
                        pageSize: pageParams.pageSize,
                      });
                    }}
                  />
                </Tooltip>
              </Space>
            </div>
          </div>
        )}
        pagination={{
          ...pageParams,
          responsive: true,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: [5, 10, 20, 50],
          showTotal: (total, range) => {
            return (
              <div>{`第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`}</div>
            );
          },
          onChange: (page, pageSize) => {
            fetchData({
              current: page,
              pageSize: pageSize,
            });
          },
        }}
        rowSelection={{
          type: 'checkbox',
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        columns={columns}
        scroll={{ x: 1300 }}
        expandable={{
          expandIcon: ({ expanded, onExpand, record }) =>
            record?.imgs?.length > 1 ? (
              expanded ? (
                <UpCircleOutlined
                  onClick={(e) => onExpand(record, e)}
                  style={{ color: '#8462bb' }}
                />
              ) : (
                <DownCircleOutlined
                  onClick={(e) => onExpand(record, e)}
                  style={{ color: '#8462bb' }}
                />
              )
            ) : null,
          expandedRowRender: (record, index) => {
            const { imgs, title, content } = record;
            return (
              <List
                style={{ padding: '0 138px' }}
                size="large"
                dataSource={imgs}
                renderItem={(item: any, itemIndex) => {
                  return (
                    <List.Item style={{ maxWidth: 850 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ marginRight: 10 }}>{`${
                          (pageParams.current - 1) * pageParams.pageSize +
                          index +
                          1
                        } - ${itemIndex + 1}`}</span>
                        <Image
                          alt={content || title}
                          width={60}
                          height={60}
                          src={item?.url}
                          style={{ objectFit: 'cover' }}
                          fallback={guoqi}
                        ></Image>
                      </div>
                      <Popconfirm
                        key="delete"
                        cancelText="取消"
                        okText="删除"
                        title="确定要删除此图片？"
                        onConfirm={async () => {
                          try {
                            const res = await deleteWorkItemAPI({
                              id: record?._id,
                              itemId: item?._id,
                            });
                            if (res?.code === 0) {
                              message.success(res?.message);
                              fetchData({
                                current: pageParams.current,
                                pageSize: pageParams.pageSize,
                              });
                            } else {
                              message.error(res?.message || '删除失败');
                            }
                          } catch (error) {
                            message.error('删除失败');
                          }
                        }}
                      >
                        <IconFont
                          type="icon-shanchu3"
                          style={{ fontSize: 22, color: '#ff5959' }}
                        />
                      </Popconfirm>
                    </List.Item>
                  );
                }}
              />
            );
          },
          rowExpandable: (record) => record?.imgs?.length > 1,
        }}
        dataSource={data}
      />
    </Card>
  );
};

export default TableList;
