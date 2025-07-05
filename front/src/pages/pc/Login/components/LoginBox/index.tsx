import React, { useState } from 'react';
import styles from './styles.less';
import Login from '../Login';
import Register from '../Register';
import ResetPassword from '../ResetPassword';

const LoginBox = () => {
  const [activeType, setActiveType] = useState(0);
  return (
    <div className={styles.pcLoginBox}>
      {activeType === 0 && <Login />}
      {activeType === 1 && <Register onSwitch={() => setActiveType(0)} />}
      {activeType === 2 && <ResetPassword onSwitch={() => setActiveType(0)} />}
      <div className={styles.bottom}>
        {activeType === 2 ? (
          <span
            onClick={() => {
              setActiveType(0);
            }}
          >
            返回登录
          </span>
        ) : (
          <>
            <span
              onClick={() => {
                setActiveType(activeType === 0 ? 1 : 0);
              }}
            >
              {activeType === 1 ? '已有账号？去登录' : '还没有账号？去注册'}
            </span>
            <span
              onClick={() => {
                setActiveType(2);
              }}
            >
              忘记密码？
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginBox;
