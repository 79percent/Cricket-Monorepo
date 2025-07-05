import React, { useState, useEffect } from 'react';
import Table from '../Table';

const TableList = () => {
  return (
    <Table
      title="全部投稿"
      apiParams={{
        userId: localStorage.getItem('userId'),
        status: 'all',
      }}
    ></Table>
  );
};

export default TableList;
