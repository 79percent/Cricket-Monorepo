import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { LockOutlined, MailOutlined, UserOutlined, AlignCenterOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { message } from 'antd';
import styles from './styles.less';
import { verifyFieldAPI, addAccountAPI } from '@/api/user';

const Add: React.FC = () => {
  const formRef = useRef<ProFormInstance>();

  const validatorField = async (key: string, value: any) => {
    try {
      if (!value) {
        return Promise.resolve();
      }
      const res = await verifyFieldAPI({
        [key]: value,
      });
      return res?.code === 0 ? Promise.resolve() : Promise.reject(new Error(res?.message));
    } catch (error) {
      return Promise.reject(new Error('校验失败'));
    }
  };

  return (
    <PageContainer>
      <ProCard>
        <ProForm
          initialValues={{
            authority: '2',
          }}
          style={{ textAlign: 'center' }}
          formRef={formRef}
          onValuesChange={(changes, values) => {
            const { authority } = values;
            if (authority === '2') {
              const newValues: any = {
                password: 'cricket_666',
              };
              const { account } = changes;
              if (account) {
                newValues.email = `${account}@cricket.com`;
              }
              formRef.current?.setFieldsValue(newValues);
            }
          }}
          onFinish={async (values: any) => {
            try {
              const res = await addAccountAPI(values);
              if (res?.code === 0) {
                message.success(res?.message);
                formRef.current?.resetFields();
              } else {
                message.error(res?.message);
              }
            } catch (error) {}
          }}
        >
          <ProForm.Group>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              width="md"
              name="account"
              hasFeedback
              label="账号"
              placeholder={'请输入账号'}
              rules={[
                {
                  required: true,
                  message: '账号是必填项！',
                },
                {
                  validator: async (_, value) => validatorField('account', value),
                },
              ]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText.Password
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              width="md"
              name="password"
              label="密码"
              placeholder={'请输入密码'}
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <AlignCenterOutlined className={styles.prefixIcon} />,
              }}
              width="md"
              name="name"
              label="昵称"
              hasFeedback
              placeholder={'请输入昵称'}
              rules={[
                {
                  required: true,
                  message: '昵称是必填项！',
                },
                {
                  validator: async (_, value) => validatorField('name', value),
                },
              ]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined className={styles.prefixIcon} />,
              }}
              width="md"
              name="email"
              label="邮箱"
              hasFeedback
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
                {
                  validator: async (_, value) => validatorField('email', value),
                },
              ]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              options={[
                {
                  value: '0',
                  label: '普通用户',
                },
                {
                  value: '1',
                  label: '管理员',
                },
                {
                  value: '2',
                  label: '系统用户',
                },
              ]}
              width="md"
              name="authority"
              label="权限"
            />
          </ProForm.Group>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};

export default Add;
