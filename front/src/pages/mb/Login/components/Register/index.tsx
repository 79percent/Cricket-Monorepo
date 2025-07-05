import React, { useState } from 'react';
import styles from './styles.less';
import { Button, Form, Input, Spin } from 'antd';
import { verifyFieldAPI, sendEmailCodeAPI, registerAPI } from '@/api/user';
import { Link } from 'umi';
import { LoadingOutlined } from '@ant-design/icons';

interface Props {
  onSwitch?: (balue: boolean) => void;
}

const Register = (props: Props) => {
  const { onSwitch } = props;
  const [form] = Form.useForm();
  const [hasSend, setHasSend] = useState(false); // 是否已发送邮箱验证码
  const [isSending, setIsSending] = useState(false); // 是否正在发送验证码

  // 获取验证码按钮
  const addonAfter = (
    <div
      className={styles.codeRight}
      style={{
        cursor: hasSend ? 'not-allowed' : 'pointer',
      }}
      onClick={async () => {
        if (hasSend || isSending) {
          return;
        }
        await form.validateFields(['email']);
        const email = form.getFieldValue('email');
        setIsSending(true);
        const res = await sendEmailCodeAPI({
          email,
        }).finally(() => {
          setIsSending(false);
        });
        if (res.code === 0) {
          setHasSend(true);
        }
      }}
    >
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 16 }} />}
        spinning={isSending}
      >
        {hasSend ? '已发送' : '获取验证码'}
      </Spin>
    </div>
  );

  return (
    <div className={styles.box}>
      <Form
        name="register"
        layout="vertical"
        form={form}
        onValuesChange={(changedValues, allValues) => {
          const entries = Object.entries(changedValues);
          const [name, value] = entries[0];
          if (name === 'email') {
            setHasSend(false);
            setIsSending(false);
          }
        }}
        scrollToFirstError={true}
        onFinish={async (values) => {
          const res = await registerAPI(values);
          if (res.code === 0) {
            if (typeof onSwitch === 'function') onSwitch(false);
          }
        }}
      >
        <div className={styles.logoBox}>
          <Link to="/pc/home">
            <div className={styles.logo}></div>
          </Link>
        </div>
        <div className={styles.header}></div>
        <Form.Item
          label="用户名"
          name="name"
          hasFeedback
          rules={[
            { required: true, message: '请输入用户名！' },
            {
              max: 16,
              message: '长度不能大于16',
            },
            {
              validator: async (_, value) => {
                try {
                  if (!value) {
                    return Promise.resolve();
                  }
                  const res = await verifyFieldAPI({
                    name: value,
                  });
                  const { code, message } = res;
                  return code === 0
                    ? Promise.resolve()
                    : Promise.reject(new Error(message));
                } catch (error) {
                  return Promise.reject(new Error('校验失败'));
                }
              },
            },
          ]}
        >
          <Input placeholder="您的用户名" allowClear size="large" />
        </Form.Item>
        <Form.Item
          label="账号"
          name="account"
          hasFeedback
          rules={[
            { required: true, message: '请输入账号！' },
            {
              validator: async (_, value) => {
                try {
                  if (!value) {
                    return Promise.resolve();
                  }
                  const res = await verifyFieldAPI({
                    account: value,
                  });
                  const { code, data, message } = res;
                  return code === 0
                    ? Promise.resolve()
                    : Promise.reject(new Error(message));
                } catch (error) {
                  return Promise.reject(new Error('校验失败'));
                }
              },
            },
          ]}
        >
          <Input placeholder="您的账号" allowClear size="large" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码！' }]}
        >
          <Input.Password placeholder="您的密码" allowClear size="large" />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          hasFeedback
          rules={[
            { required: true, message: '请输入邮箱！' },
            {
              type: 'email',
              message: '邮箱格式不正确',
            },
            {
              validator: async (_, value) => {
                try {
                  if (!value) {
                    return Promise.resolve();
                  }
                  const res = await verifyFieldAPI({
                    email: value,
                  });
                  const { code, data, message } = res;
                  return code === 0
                    ? Promise.resolve()
                    : Promise.reject(new Error(message));
                } catch (error) {
                  return Promise.reject(new Error('校验失败'));
                }
              },
            },
          ]}
        >
          <Input placeholder="您的邮箱" allowClear size="large" />
        </Form.Item>
        <Form.Item
          label="验证码"
          name="code"
          rules={[{ required: true, message: '请输入邮箱验证码！' }]}
        >
          <Input
            size="large"
            placeholder="邮箱验证码"
            allowClear
            style={{
              height: '5rem',
              fontSize: '1.8rem',
            }}
            addonAfter={addonAfter}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            style={{
              width: '100%',
              height: '5rem',
              backgroundColor: '#8462bb',
              borderColor: '#8462bb',
              borderRadius: '0.5rem',
              fontSize: '1.8rem',
            }}
          >
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
