import React, { useState, useEffect } from 'react';
import Table from '../Table';

const TableList = () => {
  return (
    <Table
      title="审核已通过"
      apiParams={{
        userId: localStorage.getItem('userId'),
        status: '1',
      }}
    ></Table>
  );
};

export default TableList;
