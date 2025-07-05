import React from 'react';
import Table from '../components/TableList';

const TableList: React.FC = () => {
  return (
    <Table
      title="审核未通过列表"
      hideUnPass
      apiParmas={{
        status: '2',
      }}
    />
  );
};

export default TableList;
