import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { updatePasswordAPI } from '@/api/user';
import styles from './styles.less';
import { useModel } from 'umi';

const Left = () => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  const handleFinish = async (values: any) => {
    try {
      setSubmitLoading(true);
      const { password } = values;
      const res = await updatePasswordAPI({
        password,
      });
      if (res.code === 0) {
        const newUserInfo = await initialState?.fetchUserInfo();
        await setInitialState({
          ...initialState,
          currentUser: newUserInfo,
        } as any);
        message.success(res?.message);
      } else {
        message.error(res?.message || '更新失败');
      }
      setSubmitLoading(false);
    } catch (error) {
      setSubmitLoading(false);
    }
  };

  return (
    <div className={styles.pcSetPassword}>
      <Form
        name="updatePassword"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12 }}
        layout="horizontal"
        scrollToFirstError={true}
        onFinish={handleFinish}
      >
        <Form.Item
          label="密码"
          name="password"
          hasFeedback
          rules={[
            {
              required: true,
              message: '请输入密码!',
            },
            {
              min: 5,
              message: '太短了哦，密码长度至少大于5位',
            },
          ]}
        >
          <Input.Password
            allowClear
            visibilityToggle={true}
            placeholder="输入您的密码"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <Form.Item
          label="确认密码"
          dependencies={['password']}
          name="confirmPassword"
          hasFeedback
          rules={[
            {
              required: true,
              message: '请再次输入密码!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('两次密码不一致!'));
              },
            }),
          ]}
        >
          <Input.Password
            allowClear
            visibilityToggle={true}
            placeholder="输入您的密码"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
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
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Left;
