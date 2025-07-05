import React from 'react';
import Table from '../components/TableList';

const TableList: React.FC = () => {
  return (
    <Table
      title="待审核列表"
      apiParmas={{
        status: '0',
      }}
    />
  );
};

export default TableList;
