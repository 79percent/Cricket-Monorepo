import React, { useState, useEffect } from 'react';
import type { SelectProps } from 'antd';
import { Select } from 'antd';
import { getUserListAPI } from '@/api/user';

const { Option } = Select;

const SystemUserSelect: React.FC<SelectProps> = (props) => {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [pageParams, setPageParams] = useState<{
    current: number;
    pageSize: number;
    total: number;
  }>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchNextPage = async (params: any = {}) => {
    setLoading(true);
    setData([]);
    const res = await getUserListAPI({
      ...params,
      keyword,
      current: pageParams.current + 1,
      pageSize: pageParams.pageSize,
      authority: '2',
    });
    if (res?.code === 0) {
      setData(data.concat(res?.data));
      setPageParams({
        current: res?.current,
        pageSize: res?.pageSize,
        total: res?.total,
      });
    }
    setLoading(false);
  };

  const init = async (params: any = {}) => {
    setLoading(true);
    const res = await getUserListAPI({
      ...params,
      current: 1,
      pageSize: 10,
      authority: '2',
    });
    if (res?.code === 0) {
      setData(res?.data);
      setPageParams({
        current: res?.current,
        pageSize: res?.pageSize,
        total: res?.total,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Select
      {...props}
      showSearch
      loading={loading}
      filterOption={false} //关闭自动筛选
      optionFilterProp="label"
      defaultActiveFirstOption={false}
      onSearch={(value) => {
        setKeyword(value);
        init({
          keyword: value,
        });
      }}
      placeholder="请选择用户"
      onPopupScroll={(e) => {
        e.persist();
        const { target } = e;
        // @ts-ignore
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
          if (data.length < pageParams.total) {
            fetchNextPage();
          }
        }
      }}
    >
      {data.map((item) => {
        return (
          <Option key={item?._id} value={item?._id}>
            {item?.name}
          </Option>
        );
      })}
    </Select>
  );
};

export default SystemUserSelect;
