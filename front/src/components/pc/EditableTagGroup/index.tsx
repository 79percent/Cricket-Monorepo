import React, { Component } from 'react';
import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './styles.less';

interface Props {
  value: any[];
  maxCount: number;
  onChange: (values: any[]) => void;
  history?: string[];
}

interface State {
  tags: any[];
  inputVisible: boolean;
  inputValue: string;
  editInputIndex: number;
  editInputValue: string;
}

const colorList = [
  'purple',
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'green',
  'cyan',
  'blue',
];

/**
 * 可编辑Tag组
 */
class EditableTagGroup extends React.Component<Props> {
  static defaultProps = {
    value: [],
    maxCount: Infinity,
    onChange: () => {},
    history: [],
  };

  private input: React.LegacyRef<Input> | undefined = undefined;
  private editInput: React.LegacyRef<Input> | undefined = undefined;

  state: State = {
    tags: [],
    inputVisible: false,
    inputValue: '',
    editInputIndex: -1,
    editInputValue: '',
  };

  componentDidMount() {
    const { value = [], maxCount = Infinity } = this.props;
    const newTags: any[] = [];
    value.forEach((item, index) => {
      if (index < maxCount) {
        newTags.push(item);
      }
    });
    this.setState({
      tags: newTags,
    });
  }

  componentDidUpdate(prevProps) {
    const { value: prevValue } = prevProps;
    const { value, maxCount = Infinity } = this.props;
    if (JSON.stringify(prevValue) !== JSON.stringify(value)) {
      const newTags: any[] = [];
      value.forEach((item, index) => {
        if (index < maxCount) {
          newTags.push(item);
        }
      });
      this.setState({
        tags: newTags,
      });
    }
  }

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter((tag) => tag !== removedTag);
    this.setState({ tags });
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(tags);
    }
  };

  showInput = () => {
    // @ts-ignore
    this.setState({ inputVisible: true }, () => this.input?.focus());
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleAddTag = (inputValue) => {
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(tags);
    }
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    this.handleAddTag(inputValue);
  };

  handleEditInputChange = (e) => {
    this.setState({ editInputValue: e.target.value });
  };

  handleEditInputConfirm = () => {
    this.setState(
      (state: State) => {
        const { tags, editInputIndex, editInputValue } = state;
        const newTags = [...tags];
        newTags[editInputIndex] = editInputValue;

        return {
          tags: newTags,
          editInputIndex: -1,
          editInputValue: '',
        };
      },
      () => {
        const { tags } = this.state;
        const { onChange } = this.props;
        if (typeof onChange === 'function') {
          onChange(tags);
        }
      },
    );
  };

  saveInputRef = (input) => {
    this.input = input;
  };

  render() {
    const { tags, inputVisible, inputValue, editInputIndex, editInputValue } =
      this.state;
    const { maxCount = Infinity, history = [] } = this.props;
    return (
      <>
        <div style={{ marginBottom: 12 }}>
          {tags.map((item, index) => {
            const color = colorList[index % colorList.length];
            const tag = `#${item}`;
            const tagElem = (
              <Tag
                color={color}
                className={styles.editTag}
                key={tag}
                onClick={() => this.handleClose(item)}
              >
                <span className={styles.tag}>{tag}</span>
              </Tag>
            );
            return tagElem;
          })}
          {/* 添加新标签输入框 */}
          {inputVisible && tags.length < maxCount && (
            <span>
              <Input
                ref={this.saveInputRef}
                type="text"
                size="small"
                style={{ width: 120 }}
                className={styles.tagInput}
                value={inputValue}
                onChange={this.handleInputChange}
                onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
            </span>
          )}
          {/* 添加标签按钮 */}
          {!inputVisible && tags.length < maxCount && (
            <Tag className={styles.siteTagPlus} onClick={this.showInput}>
              <PlusOutlined /> 添加标签
            </Tag>
          )}
        </div>
        <div>
          <span style={{ marginRight: 8 }}>最近使用过的标签：</span>
          {history.map((item, index) => {
            const color = colorList[(index + 5) % colorList.length];
            const tag = `#${item}`;
            return (
              <Tag
                color={color}
                className={styles.editTag}
                key={tag}
                onClick={() => this.handleAddTag(item)}
              >
                <span>{tag}</span>
              </Tag>
            );
          })}
        </div>
      </>
    );
  }
}

export default EditableTagGroup;
