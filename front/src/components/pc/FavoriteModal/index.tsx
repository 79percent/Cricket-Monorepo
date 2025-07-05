import React, { useState, useEffect } from 'react';
import { connect, FavoritesModelState, LoginModelState, Dispatch } from 'umi';
import {
  Button,
  Modal,
  Form,
  Input,
  Tooltip,
  Checkbox,
  Row,
  Col,
  message,
} from 'antd';
import styles from './styles.less';
import './checkbox.less';
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';

interface Props {
  visible: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
  dispatch: Dispatch;
  favorites: FavoritesModelState;
  login: LoginModelState;
  workId?: string;
}

/**
 * 收藏模态框弹窗
 */
const FavoriteModal: React.FC<Props> = ({
  visible,
  onOk,
  onCancel,
  dispatch,
  favorites,
  login,
  workId,
}) => {
  const { userId } = login;
  const { list, countMap, favoritesArr } = favorites;
  const [form] = Form.useForm();
  const [inputValue, setInputValue] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const handleClickAddBtn = async () => {
    setAddLoading(true);
    const res: any = await dispatch({
      type: 'favorites/addFavorite',
      payload: {
        title: inputValue,
      },
    });
    if (res?.code === 0) {
      sessionStorage.removeItem('favorite_work_id');
      const { _id } = res?.data || {};
      const oldFavorites = form.getFieldValue('favorites');
      form.setFields([
        {
          name: 'favorites',
          value: [...oldFavorites, _id],
        },
      ]);
      setInputValue('');
    } else {
      message.error(res?.message || '创建失败');
    }
    setAddLoading(false);
  };

  useEffect(() => {
    if (visible) {
      form.setFields([
        {
          name: 'favorites',
          value: favoritesArr,
        },
      ]);
    }
  }, [visible]);

  useEffect(() => {
    sessionStorage.removeItem('favorite_work_id');
  }, []);

  return (
    <Modal
      width={420}
      visible={visible}
      title={<div className={styles.title}>添加到收藏夹</div>}
      okText="确定"
      cancelText="取消"
      footer={
        <div className={styles.footer}>
          <Button
            style={{
              width: 160,
              height: 40,
              borderColor: 'rgb(132, 98, 187)',
              backgroundColor: 'rgb(132, 98, 187)',
              color: '#fff',
              borderRadius: 5,
            }}
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  onOk(values);
                })
                .catch((info) => {
                  console.log('Validate Failed:', info);
                });
            }}
          >
            确定
          </Button>
        </div>
      }
      onCancel={onCancel}
      bodyStyle={{
        padding: 0,
      }}
    >
      <div className={styles.content}>
        <Form
          layout="vertical"
          name="favoriteModal"
          form={form}
          onValuesChange={(changedValues, allValues) => {
            // const { favorites } = allValues;
            // dispatch({
            //   type: 'favorites/saveState',
            //   payload: {
            //     favoritesArr: favorites,
            //   },
            // });
          }}
        >
          <Form.Item name="favorites" label="">
            <Checkbox.Group style={{ width: '100%', minHeight: 180 }}>
              {list.map((item) => (
                <Row key={item._id} className={styles.rowItem}>
                  <Col span={24}>
                    <Checkbox
                      value={item._id}
                      style={{ width: '100%', lineHeight: '40px' }}
                    >
                      <div className={styles.favorite}>
                        <span>{item.title}</span>
                        <span className={styles.count}>
                          {countMap[item._id]}
                        </span>
                      </div>
                    </Checkbox>
                  </Col>
                </Row>
              ))}
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.newAdd}>
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          maxLength={20}
          placeholder="收藏夹名称"
          prefix={<PlusOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
          suffix={
            <Tooltip title="名称长度不能超过20">
              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
          }
          addonAfter={
            <div className={styles.addBtn}>
              <Button
                loading={addLoading}
                style={{
                  width: '100%',
                  borderWidth: 0,
                  backgroundColor: 'transparent',
                }}
                onClick={handleClickAddBtn}
              >
                新建
              </Button>
            </div>
          }
        />
      </div>
    </Modal>
  );
};

export default connect(
  ({
    favorites,
    login,
  }: {
    favorites: FavoritesModelState;
    login: LoginModelState;
  }) => ({
    favorites,
    login,
  }),
)(FavoriteModal);
