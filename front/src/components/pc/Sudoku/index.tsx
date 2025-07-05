import React, { useState } from 'react';
import styles from './styles.less';
import guoqi from '@/assets/icon/D-tupianguoqi1.svg';
import { Image } from 'antd';

interface Props {
  /** 外层容器样式 */
  style?: React.CSSProperties;
  /** 图片之间的间隙 */
  gap?: number;
  /** 每张图片的宽度 */
  itemWidth?: number;
  /** 每张图片的高度 */
  itemHeight?: number;
  /** 列数 */
  columnNum?: number;
  /** 最大行数 */
  maxRowNum?: number;
  /** 图片数据源 */
  data?: any[];
}

/**
 * 九宫格图片组件
 */
const Sudoku: React.FC<Props> = ({
  columnNum = 3,
  maxRowNum = 3,
  style = {},
  gap = 8,
  itemWidth = 120,
  itemHeight = 120,
  data = [],
}) => {
  const [visible, setVisible] = useState(false);
  const [previewCurrent, setCurrent] = useState(0);

  const imgNum = data.length;
  let rowNum = Math.ceil(imgNum / columnNum);
  let showMoreNum = false; // 展示剩余图片数量
  if (rowNum > maxRowNum) {
    rowNum = maxRowNum;
    showMoreNum = true;
  }
  const containerWidth = columnNum * itemWidth + (columnNum - 1) * gap;
  return (
    <div
      className={styles.imgView}
      style={{
        gridTemplateRows: `repeat(${rowNum}, ${itemHeight}px)`,
        gridTemplateColumns: `repeat(${columnNum}, ${itemWidth}px)`,
        gridGap: gap,
        width: containerWidth,
        ...style,
      }}
    >
      {data.map((img, index) =>
        index >= rowNum * columnNum ? null : (
          <div className={styles.imgItem} key={img?._id}>
            <Image
              width={itemWidth}
              height={itemHeight}
              preview={{ visible: false }}
              alt={img?.content}
              src={img?.urlMin}
              fallback={guoqi}
              className={styles.imgView}
              onClick={() => {
                setVisible(true);
                setCurrent(index);
              }}
            />
          </div>
        ),
      )}
      {showMoreNum && (
        <div
          className={styles.moreNum}
          style={{
            width: itemWidth,
            height: itemHeight,
            lineHeight: `${itemHeight}px`,
          }}
          onClick={() => {
            setVisible(true);
            setCurrent(8);
          }}
        >
          {`+ ${imgNum - rowNum * columnNum}`}
        </div>
      )}
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible,
            onVisibleChange: (vis) => setVisible(vis),
            current: previewCurrent,
          }}
        >
          {data.map((img) => (
            <Image key={img?._id} src={img?.url} />
          ))}
        </Image.PreviewGroup>
      </div>
    </div>
  );
};

export default Sudoku;
