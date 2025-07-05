import React, { useState } from 'react';
import type { ModalProps } from 'antd';
import { Modal, Select, Input, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

interface Props {
  onOk?: (value: string) => void;
}

const options = [
  {
    key: '0',
    value: '涉及色情',
  },
  {
    key: '1',
    value: '涉及政治',
  },
  {
    key: '2',
    value: '涉及血腥、恐怖、暴力',
  },
  {
    key: '3',
    value: '其他原因',
  },
];

const optionsMap = {
  0: '涉及色情',
  1: '涉及政治',
  2: '涉及血腥、恐怖、暴力',
  3: '其他原因',
};

const UnPassModal: React.FC<Props & ModalProps> = ({ onOk, ...rest }) => {
  const [selectValue, setSelectValue] = useState<string | undefined>(undefined);
  const [inputValue, setInputValue] = useState<string>('');
  return (
    <Modal
      title="原因"
      {...rest}
      onOk={() => {
        if (!selectValue) {
          message.warning('请选择原因');
          return;
        }
        if (typeof onOk === 'function') {
          onOk(selectValue === '3' ? inputValue : optionsMap[selectValue]);
        }
      }}
    >
      <Select
        style={{
          width: '100%',
        }}
        onChange={(value: string) => {
          setSelectValue(value);
        }}
        placeholder="请选择原因"
      >
        {options.map((item) => {
          return (
            <Option key={item.key} value={item.key}>
              {item.value}
            </Option>
          );
        })}
      </Select>
      {selectValue === '3' && (
        <TextArea
          style={{ marginTop: 20 }}
          rows={4}
          value={inputValue}
          placeholder="请输入原因"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
      )}
    </Modal>
  );
};

export default UnPassModal;
