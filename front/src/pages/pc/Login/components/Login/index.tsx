import React from 'react';
import styles from './styles.less';
import {
  connect,
  Link,
  history,
  useModel,
  LoginModelState,
  Dispatch,
} from 'umi';
import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

interface Props {
  login: LoginModelState;
  dispatch: Dispatch;
}

const Login: React.FC<Props> = (props) => {
  const { dispatch, login } = props;
  const [form] = Form.useForm();
  const { refresh } = useModel('@@initialState');

  const handleFinish = async (values) => {
    const res = await dispatch({
      type: 'login/login',
      payload: values,
    });
    if (res?.code === 0) {
      await refresh();
      if (login?.needGoBack) {
        dispatch({
          type: 'login/saveState',
          payload: {
            needGoBack: false,
          },
        });
        history.goBack();
      } else {
        history.push('/pc/home');
      }
    } else {
      message.error(res?.message || '登录失败!');
    }
  };

  return (
    <div className={styles.box}>
      <Form
        name="login"
        layout="vertical"
        form={form}
        scrollToFirstError={true}
        onFinish={handleFinish}
      >
        <div className={styles.logoBox}>
          <Link to="/pc/home">
            <div className={styles.logo}></div>
          </Link>
        </div>
        <div className={styles.header}></div>
        <Form.Item
          label=""
          name="account"
          rules={[{ required: true, message: '请输入账号/昵称！' }]}
        >
          <Input
            placeholder="账号/昵称"
            allowClear
            prefix={<UserOutlined style={{ color: '#888' }} />}
          />
        </Form.Item>
        <Form.Item
          label=""
          name="password"
          rules={[{ required: true, message: '请输入密码！' }]}
        >
          <Input.Password
            placeholder="密码"
            allowClear
            prefix={<LockOutlined style={{ color: '#888' }} />}
          />
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
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(({ login }: { login: LoginModelState }) => ({
  login,
}))(Login);
