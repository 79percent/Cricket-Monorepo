import React, { useState } from 'react';
import styles from './styles.less';
import { Button, Form, Input, message, Spin } from 'antd';
import { verifyFieldAPI, sendEmailCodeAPI, resetPasswordAPI } from '@/api/user';
import { Link } from 'umi';
import { LoadingOutlined } from '@ant-design/icons';

interface Props {
  onSwitch?: () => void;
}

const ResetPassword = (props: Props) => {
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
          const res = await resetPasswordAPI(values);
          if (res.code === 0) {
            message.success(res?.message);
            if (typeof onSwitch === 'function') onSwitch();
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
                  return code === 1
                    ? Promise.resolve()
                    : Promise.reject(new Error('邮箱未注册'));
                } catch (error) {
                  return Promise.reject(new Error('校验失败'));
                }
              },
            },
          ]}
        >
          <Input placeholder="您的邮箱" allowClear />
        </Form.Item>
        <Form.Item
          label="验证码"
          name="code"
          rules={[{ required: true, message: '请输入邮箱验证码！' }]}
        >
          <Input placeholder="邮箱验证码" allowClear addonAfter={addonAfter} />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="password"
          rules={[{ required: true, message: '请输入密码！' }]}
        >
          <Input.Password placeholder="您的新密码" allowClear />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            style={{
              width: '100%',
              backgroundColor: '#8462bb',
              borderColor: '#8462bb',
              borderRadius: 5,
            }}
          >
            重置密码
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;
