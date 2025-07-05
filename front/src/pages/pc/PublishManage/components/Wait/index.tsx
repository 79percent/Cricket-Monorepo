import React, { useState, useEffect } from 'react';
import Table from '../Table';

const TableList = () => {
  return (
    <Table
      title="待审核"
      apiParams={{
        userId: localStorage.getItem('userId'),
        status: '0',
      }}
    ></Table>
  );
};

export default TableList;
