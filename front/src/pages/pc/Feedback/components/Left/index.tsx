import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useModel } from 'umi';
import { addFeedbackAPI } from '@/api/feedback';
import styles from './styles.less';

const { TextArea } = Input;

const Left: React.FC = () => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser || {};

  const handleFinish = async (values: any) => {
    try {
      setSubmitLoading(true);
      const { content } = values;
      const res = await addFeedbackAPI({
        content,
      });
      if (res.code === 0) {
        const newUserInfo = await initialState?.fetchUserInfo();
        await setInitialState({
          ...initialState,
          currentUser: newUserInfo,
        } as any);
        message.success(res?.message);
      } else {
        message.error(res?.message || '提交失败');
      }
      setSubmitLoading(false);
    } catch (error) {
      setSubmitLoading(false);
    }
  };

  return (
    <div className={styles.pcFeedBackForm}>
      <Form
        name="feedback"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        scrollToFirstError={true}
        onFinish={handleFinish}
      >
        <Form.Item
          label="内容"
          name="content"
          rules={[
            {
              required: true,
              message: '还没有填写内容',
            },
          ]}
        >
          <TextArea rows={4} placeholder="这里输入您的宝贵意见" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitLoading}
            style={{
              backgroundColor: 'rgb(132, 98, 187)',
              borderColor: 'rgb(132, 98, 187)',
              width: 120,
            }}
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Left;
