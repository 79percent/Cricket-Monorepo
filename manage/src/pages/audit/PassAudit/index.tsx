import React from 'react';
import Table from '../components/TableList';

const TableList: React.FC = () => {
  return (
    <Table
      title="审核已通过列表"
      hidePass
      apiParmas={{
        status: '1',
      }}
    />
  );
};

export default TableList;
