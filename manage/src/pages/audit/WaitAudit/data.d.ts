export type TableListItem = {
  content: string;
  createTime: string | number;
  creator: {
    avatar: string;
    avatarMin: string;
    name: string;
    _id: string;
  };
  creatorId: string;
  imgs: {
    imgHeight: number;
    imgWidth: number;
    url: string;
    urlMin: string;
    _id: string;
  }[];
  status: string;
  tags: string[];
  title: string;
  updateTime: string | number;
  _id: string;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
