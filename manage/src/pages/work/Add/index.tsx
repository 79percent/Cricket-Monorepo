import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Form, Input, Button, message } from 'antd';
import EditableTagGroup from '@/components/EditableTagGroup';
import PicturesWall from '@/components/PicturesWall';
import Extra from '@/components/FormExtra';
import { adminAddWorkAPI } from '@/api/works';
import SystemUserSelect from '@/components/SystemUserSelect';

const { TextArea } = Input;

const Add: React.FC = () => {
  const [contentLen, setContentLen] = useState(0);
  const [titleLen, setTitleLen] = useState(0);
  const [workLen, setWorkLen] = useState(0);
  const [historyTag, setHistory] = useState<string[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    // 持久化存储标签
    const localHistoryTags = localStorage.getItem('history_used_tags');
    if (localHistoryTags) {
      setHistory(localHistoryTags?.split('c_r_i_c_k_e_t'));
    }
  }, []);

  return (
    <PageContainer>
      <ProCard>
        <Form
          name="publishWork"
          form={form}
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 24 }}
          layout="horizontal"
          scrollToFirstError={true}
          onFinish={async (values) => {
            const { work, tags, content, title, creator } = values;
            const formData = new FormData();
            work.forEach((item: any, index: number) => {
              formData.append(`work[${index}]`, item?.originFileObj);
            });
            formData.append('tags', tags);
            formData.append('title', title || '');
            formData.append('content', content || '');
            formData.append('creator', creator);
            const res = await adminAddWorkAPI(formData);
            if (res?.code === 0) {
              message.success(res?.message);
              form.setFieldsValue({
                title: '',
                work: [],
                content: '',
                tags: [],
                creator: undefined,
              });
              const oldHistory = localStorage.getItem('history_used_tags');
              const oldHistoryArr = oldHistory?.split('c_r_i_c_k_e_t') || [];
              // 保存最近的10个
              const newHistory = [...new Set([...tags, ...oldHistoryArr])].filter(
                (item, index) => index < 10,
              );
              setHistory(newHistory);
              localStorage.setItem('history_used_tags', newHistory.join('c_r_i_c_k_e_t'));
            } else {
              message.error(res?.message);
            }
          }}
          onValuesChange={(changedValues, allValues) => {
            const { content, title, work } = allValues;
            setContentLen(content?.length ?? 0);
            setTitleLen(title?.length ?? 0);
            setWorkLen(work?.length ?? 0);
          }}
        >
          <Form.Item
            label="标题"
            name="title"
            wrapperCol={{ span: 12 }}
            extra={<Extra left={<span></span>} right={<span>{`${titleLen}/50`}</span>} />}
            rules={[
              {
                max: 50,
                message: '超出50个字符了哦',
              },
            ]}
          >
            <Input allowClear placeholder="请输入标题" />
          </Form.Item>

          <Form.Item
            label="图片"
            name="work"
            extra={
              <Extra
                left={
                  <span>
                    <div style={{ display: 'block' }}>{`点击上传图片 ${workLen}/20`}</div>
                    *支持格式：jpg/jpeg/png/webp/gif
                  </span>
                }
                right={null}
              />
            }
            rules={[
              {
                required: true,
                message: '是不是忘了上传图片',
              },
            ]}
          >
            <PicturesWall multiple maxCount={20} />
          </Form.Item>
          <Form.Item
            label="标签"
            name="tags"
            // tooltip="双击标签进行编辑"
            // extra="最多添加3个标签"
            rules={[
              {
                required: true,
                message: '忘记添加标签了？',
              },
              ({}) => ({
                validator(_, tags) {
                  if (
                    !tags ||
                    tags?.length === 0 ||
                    tags?.every((item: string) => item?.length <= 30)
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('长度必须小于30'));
                },
              }),
            ]}
          >
            <EditableTagGroup history={historyTag} maxCount={10} />
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            wrapperCol={{ span: 12 }}
            extra={<Extra left={<span></span>} right={<span>{`${contentLen}/200`}</span>} />}
            rules={[
              {
                max: 200,
                message: '超出200个字符了哦',
              },
            ]}
          >
            <TextArea allowClear rows={3} placeholder="请输入内容" />
          </Form.Item>
          <Form.Item
            label="创建人"
            name="creator"
            wrapperCol={{ span: 12 }}
            rules={[
              {
                required: true,
                message: '没有选择用户',
              },
            ]}
          >
            <SystemUserSelect style={{ width: 220 }} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 2 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: 'rgb(132, 98, 187)',
                borderColor: 'rgb(132, 98, 187)',
                width: 80,
              }}
            >
              发布
            </Button>
          </Form.Item>
        </Form>
      </ProCard>
    </PageContainer>
  );
};

export default Add;
