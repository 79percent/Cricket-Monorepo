import React, { Component } from 'react';
import { Upload, Modal, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

interface Props extends UploadProps {
  onChange?: (value: any) => void;
  value?: any;
  [key: string]: any;
}

/**
 * 上传图片组件
 */
class PicturesWall extends React.Component<Props> {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
  };

  componentDidUpdate(prevProps) {
    const { value: prevValue } = prevProps;
    const { value } = this.props;
    if (value !== prevValue) {
      if (!value) {
        this.setState({
          fileList: [],
        });
      } else {
        if (Array.isArray(value)) {
          this.setState({
            fileList: value,
          });
        } else {
          this.setState({
            fileList: [value],
          });
        }
      }
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = ({ file, fileList }) => {
    this.setState({ fileList });
    const { onChange, maxCount } = this.props;
    if (typeof onChange === 'function') {
      onChange(fileList);
    }
  };

  handleRemove = (file) => {
    return true;
  };

  render() {
    const {
      listType,
      fileList: fl,
      onPreview,
      onChange,
      onRemove,
      ...rest
    } = this.props;
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const { maxCount = Infinity } = rest;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>添加</div>
      </div>
    );
    return (
      <>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
          accept=".jpg,.jpeg,.png,.webp,.gif"
          // accept="image/*"
          {...rest}
        >
          {fileList.length >= maxCount ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

export default PicturesWall;
