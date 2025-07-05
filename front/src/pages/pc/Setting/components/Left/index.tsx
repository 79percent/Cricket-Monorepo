import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, DatePicker, message } from 'antd';
import { connect, useModel } from 'umi';
import { updateInfoAPI } from '@/api/user';
import Extra from '@/components/pc/FormExtra';
import moment from 'moment';
import styles from './styles.less';

const { TextArea } = Input;

// 手机, 账号, 密码, 头像, 邮箱, 昵称, 简介
// phone, account, password, avatar, email, name, profile
const Left = () => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [nameLen, setNameLen] = useState(0);
  const [accountLen, setAccountLen] = useState(0);
  const [profileLen, setProfileLen] = useState(0);
  const { initialState, refresh, setInitialState } = useModel('@@initialState');
  const userInfo = initialState?.currentUser || {};

  const handleFinish = async (values: any) => {
    try {
      setSubmitLoading(true);
      const { birthDay } = values;
      const res = await updateInfoAPI({
        ...values,
        birthDay: birthDay ? birthDay.valueOf() : undefined,
      });
      if (res?.code === 0) {
        sessionStorage.removeItem('user_info');
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

  useEffect(() => {
    let { email, account, name, profile, sex, birthDay } = userInfo;
    const formInitialValue = {
      email,
      account,
      name,
      profile,
      sex,
      birthDay: birthDay ? moment(birthDay) : undefined,
    };
    const entries = Object.entries(formInitialValue);
    const fieldDataArr = entries.map((item) => {
      const [key, value] = item;
      return {
        name: key,
        value,
      };
    });
    form.setFields(fieldDataArr);
    setNameLen(name ? name.length : 0);
    setAccountLen(account ? account.length : 0);
    setProfileLen(profile ? profile.length : 0);
  }, [userInfo]);

  return (
    <div className={styles.pcSettingLeft}>
      <Form
        name="updateUserInfo"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12 }}
        layout="horizontal"
        scrollToFirstError={true}
        onFinish={handleFinish}
        onValuesChange={(changedValues, allValues) => {
          const { name, account, profile } = allValues;
          setNameLen(name ? name.length : 0);
          setAccountLen(account ? account.length : 0);
          setProfileLen(profile ? profile.length : 0);
        }}
      >
        <Form.Item label="账号" name="account">
          <Input placeholder="输入您的账号" disabled />
        </Form.Item>
        <Form.Item
          label="昵称"
          name="name"
          rules={[
            {
              required: true,
              message: '忘填昵称了哦！',
            },
            {
              max: 16,
              message: '昵称太长了！',
            },
          ]}
          extra={
            <Extra
              left={<span>不超过16个字符</span>}
              right={<span>{`${nameLen}/16`}</span>}
            />
          }
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item label="性别" name="sex" rules={[]}>
          <Radio.Group>
            <Radio value="0">保密</Radio>
            <Radio value="1">男</Radio>
            <Radio value="2">女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="生日" name="birthDay" rules={[]}>
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="介绍"
          name="profile"
          wrapperCol={{ span: 18 }}
          extra={
            <Extra
              left={<span>说点什么让其他人更好地了解你</span>}
              right={<span>{`${profileLen}/200`}</span>}
            />
          }
        >
          <TextArea placeholder="您的个人简介" allowClear rows={4} />
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
