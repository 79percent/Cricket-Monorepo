import React, { useState, useEffect, useRef } from 'react';
import { Tag, Select } from 'antd';
import { Link, history, connect, Dispatch, TagsModelState } from 'umi';
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';
import styles from './styles.less';

interface Props {
  dispatch: Dispatch;
  tags: TagsModelState;
  onChange?: (name: string) => void;
}

const colorList = [
  '#7EC8C0',
  '#C87E87',
  '#7EC8A4',
  '#C8A47E',
  '#BA7EC8',
  '#C87E86',
  '#C87EA3',
  '#C7C87E',
  '#C8917E',
  '#7EC88A',
  '#967EC8',
  '#827EC8',
  '#C07EC8',
  '#B2C87E',
];

/**
 * 首页标签展示组件
 * @param props
 */
const Tags: React.FC<Props> = (props) => {
  const { dispatch, tags, onChange } = props;
  const { tagsList } = tags;
  const [x, setX] = useState(0); // 移动的距离
  const [w, setW] = useState(0); // 列表总宽度
  const rowRef = useRef<HTMLDivElement>(null);
  const diffWidth = w - 1224;
  const offset = 600; // 每次移动600

  useEffect(() => {
    if (tagsList.length > 0) {
      return;
    }
    dispatch({
      type: 'tags/fetchList',
      payload: {
        curent: 1,
        pageSize: 30,
      },
    });
  }, []);

  useEffect(() => {
    const cw = rowRef.current?.clientWidth || 0;
    setW(cw);
  }, [tagsList]);

  return (
    <div className={styles.tagBox}>
      <div className={styles.headerRow}>
        <span className={styles.title}>热门标签</span>
      </div>
      <div className={styles.tagsRowContainer}>
        {/* 列表 */}
        <div
          className={styles.tagRowBox}
          style={{ transform: `translateX(${x}px)` }}
        >
          <div ref={rowRef} className={styles.tagRow}>
            {tagsList.map((item, index) => {
              return (
                <Tag
                  className={styles.tagItem}
                  color={colorList[index % colorList.length]}
                  key={item._id}
                  style={{
                    marginLeft: index === 0 ? 0 : 10,
                    borderWidth: 0,
                  }}
                >
                  <Link
                    to={`/pc/home?keyword=${item.text}`}
                    className={styles.item}
                  >{`#${item.text}`}</Link>
                </Tag>
              );
            })}
          </div>
        </div>
        {/* 左箭头 */}
        <div
          className={`${styles.arrow} ${styles.leftArrow} ${
            x === 0 && styles.hide
          }`}
          onClick={() => {
            setX(x + offset > 0 ? 0 : x + offset);
          }}
        >
          <LeftCircleFilled style={{ fontSize: 40 }} />
        </div>
        {/* 右箭头 */}
        <div
          className={`${styles.arrow} ${styles.rightArrow} ${
            (diffWidth <= 0 || diffWidth + x <= 0) && styles.hide
          }`}
          onClick={() => {
            setX(x - offset + diffWidth <= 0 ? -diffWidth : x - offset);
          }}
        >
          <RightCircleFilled style={{ fontSize: 40 }} />
        </div>
      </div>
    </div>
  );
};

export default connect(({ tags }: { tags: TagsModelState }) => ({
  tags,
}))(Tags);
