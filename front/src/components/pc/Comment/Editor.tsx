import React, { createElement, useState } from 'react';
import { Comment, Tooltip, Avatar, Form, Input, Button, Row, Col } from 'antd';

const { TextArea } = Input;

const Editor = ({
  onChange,
  onSubmit,
  submitting,
  value,
  placeholder,
  submitText = '发表',
}) => (
  <>
    <Form.Item>
      <Row gutter={16}>
        <Col span={20}>
          <Form.Item>
            <TextArea
              rows={3}
              onChange={onChange}
              value={value}
              placeholder={placeholder}
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item>
            <Button
              htmlType="submit"
              loading={submitting}
              onClick={onSubmit}
              type="primary"
              style={{
                backgroundColor: 'rgb(132, 98, 187)',
                borderColor: 'rgb(132, 98, 187)',
                width: '100%',
                height: 75,
              }}
            >
              {submitText}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form.Item>
  </>
);

export default Editor;
