import { LockOutlined, MailOutlined, UserOutlined, AlignCenterOutlined } from '@ant-design/icons';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import Footer from '@/components/Footer';
import { adminLoginAPI } from '@/api/user';
import styles from './index.less';
import logo from '@/assets/icon/logo.svg';

const Login: React.FC = () => {
  const [type, setType] = useState<string>('login');
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((state) => ({ ...state, currentUser: userInfo }));
    }
  };

  const handleLogin = async (values: any) => {
    try {
      const { account, password } = values;
      const res = await adminLoginAPI({
        account,
        password,
      });
      const { code, message: msg, data } = res || {};
      if (code === 0) {
        const { id, token } = data;
        sessionStorage.setItem('userId', id);
        sessionStorage.setItem('token', token);
        await fetchUserInfo();
        history.push('/');
        message.success(msg);
      } else {
        message.error(msg);
      }
    } catch (error) {
      message.error('登录失败！');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          // @ts-ignore
          title={
            <img
              alt="logo"
              src={logo}
              style={{
                width: 165,
                height: 72,
              }}
            />
          }
          subTitle={'后台管理系统'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={handleLogin}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="login" tab={'登录'} />
            <Tabs.TabPane key="register" tab={'注册'} disabled />
          </Tabs>
          {/* 账号密码登录 */}
          {type === 'login' && (
            <>
              <ProFormText
                name="account"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    message: '账号是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <ProFormCheckbox noStyle name="autoLogin">
                  自动登录
                </ProFormCheckbox>
                <a
                  style={{
                    float: 'right',
                  }}
                >
                  忘记密码 ?
                </a>
              </div>
            </>
          )}
          {/* 注册 */}
          {type === 'register' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                name="account"
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    message: '账号是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                name="password"
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <AlignCenterOutlined className={styles.prefixIcon} />,
                }}
                name="name"
                placeholder={'请输入昵称'}
                rules={[
                  {
                    required: true,
                    message: '昵称是必填项！',
                  },
                ]}
              />
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined className={styles.prefixIcon} />,
                }}
                name="email"
                placeholder={'请输入邮箱'}
                rules={[
                  {
                    required: true,
                    message: '邮箱是必填项！',
                  },
                  {
                    type: 'email',
                    message: '邮箱格式不正确',
                  },
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
