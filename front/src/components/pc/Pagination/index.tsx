import React, { useEffect, useReducer, Dispatch } from 'react';
import styles from './styles.less';
import {
  LeftOutlined,
  RightOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';

const positionClassName = {
  left: styles.positionLeft,
  center: styles.positionCenter,
  right: styles.positionRight,
};

interface Props {
  /** 当前页码 */
  current?: number;
  /** 总的条数 */
  total?: number;
  /** 每页条数 */
  pageSize?: number;
  /** 位置 */
  position?: 'left' | 'center' | 'right';
  /** 外层容器样式 */
  style?: React.CSSProperties;
  /** 点击页码时间 */
  onClick?: (index: number) => void;
}

type InitialStateType = {
  /** 当前页码 */
  currentSelf: number;
  /** 总的条数 */
  totalSelf: number;
  /** 每页条数 */
  pageSizeSelf: number;
};

type ActionTypeEnum = 'save';

type PayloadType = {
  /** 当前页码 */
  currentSelf?: number;
  /** 总的条数 */
  totalSelf?: number;
  /** 每页条数 */
  pageSizeSelf?: number;
};

type ActionType = {
  type: ActionTypeEnum;
  payload: PayloadType;
};

const initialState: InitialStateType = {
  currentSelf: 1,
  totalSelf: 0,
  pageSizeSelf: 10,
};

function reducer(
  state: InitialStateType,
  action: ActionType,
): InitialStateType {
  const { type, payload = {} } = action;
  switch (type) {
    case 'save':
      return {
        ...state,
        ...payload,
      };
    default:
      throw state;
  }
}

/**
 * 分页组件
 * @returns
 */
const Pagination: React.FC<Props> = ({
  current,
  total,
  pageSize,
  position = 'center',
  style,
  onClick,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentSelf, totalSelf, pageSizeSelf } = state;
  let pageCount = Math.ceil(totalSelf / pageSizeSelf);
  pageCount = pageCount > 1 ? pageCount : 1;

  useEffect(() => {
    if (current) {
      dispatch({
        type: 'save',
        payload: {
          currentSelf: current,
        },
      });
    }
  }, [current]);

  useEffect(() => {
    if (total) {
      dispatch({
        type: 'save',
        payload: {
          totalSelf: total,
        },
      });
    }
  }, [total]);

  useEffect(() => {
    if (pageSize) {
      dispatch({
        type: 'save',
        payload: {
          pageSizeSelf: pageSize,
        },
      });
    }
  }, [pageSize]);

  /**
   * 点击向前翻页
   */
  const handleClickPrev = () => {
    if (currentSelf <= 1) {
      return;
    }
    if (current === undefined) {
      dispatch({
        type: 'save',
        payload: {
          currentSelf: currentSelf - 1,
        },
      });
    }
    if (typeof onClick === 'function') {
      onClick(currentSelf - 1);
    }
  };

  /**
   * 点击页码
   */
  const handleClickPage = (index) => {
    if (index === currentSelf) {
      return;
    }
    if (current === undefined) {
      dispatch({
        type: 'save',
        payload: {
          currentSelf: index,
        },
      });
    }
    if (typeof onClick === 'function') {
      onClick(index);
    }
  };

  /**
   * 点击向后翻页
   */
  const handleClickNext = () => {
    if (currentSelf >= pageCount) {
      return;
    }
    if (current === undefined) {
      dispatch({
        type: 'save',
        payload: {
          currentSelf: currentSelf + 1,
        },
      });
    }

    if (typeof onClick === 'function') {
      onClick(currentSelf + 1);
    }
  };

  /**
   * 渲染页码
   */
  const renderPageCount = () => {
    const itemElementArr: React.ReactElement[] = [];
    let leftIndex = currentSelf - 2;
    leftIndex = leftIndex < 1 ? 1 : leftIndex;
    leftIndex = leftIndex + 4 > pageCount ? pageCount - 4 : leftIndex;
    let rightIndex = leftIndex + 4;
    rightIndex = rightIndex > pageCount ? pageCount : rightIndex;
    let showLeftEllipsis = false;
    let showRightEllipsis = false;
    for (let index = 1; index <= pageCount; index++) {
      if (
        index === 1 ||
        index === pageCount ||
        (leftIndex <= index && index <= rightIndex)
      ) {
        itemElementArr.push(
          <li
            key={index}
            className={`${styles.pcPaginationItem} ${styles.itemSpace} ${
              index === currentSelf ? styles.current : styles.noCurrent
            }`}
            onClick={() => handleClickPage(index)}
          >
            {index}
          </li>,
        );
      } else {
        if (!showLeftEllipsis && index < currentSelf) {
          showLeftEllipsis = true;
          itemElementArr.push(
            <li
              key="showLeftEllipsis"
              className={`${styles.pcPaginationItem} ${styles.itemSpace} ${styles.noCurrent}`}
            >
              <EllipsisOutlined />
            </li>,
          );
        } else if (!showRightEllipsis && index > currentSelf) {
          showRightEllipsis = true;
          itemElementArr.push(
            <li
              key={index}
              className={`${styles.pcPaginationItem} ${styles.itemSpace} ${styles.noCurrent}`}
            >
              <EllipsisOutlined />
            </li>,
          );
        }
      }
    }
    return itemElementArr;
  };

  return (
    <div className={positionClassName[position]} style={style}>
      <ul className={styles.pcPagination}>
        <li
          className={`${styles.pcPaginationItem} ${styles.noCurrent}`}
          onClick={handleClickPrev}
        >
          <LeftOutlined />
        </li>
        {renderPageCount()}
        <li
          className={`${styles.pcPaginationItem} ${styles.itemSpace} ${styles.noCurrent}`}
          onClick={handleClickNext}
        >
          <RightOutlined />
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
