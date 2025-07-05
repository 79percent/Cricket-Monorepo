import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.less';
import WorksItem from '@/components/pc/WorksItem';

let columnHeightArr: number[] = [];

/**
 * 图片瀑布流组件
 * @param props
 * @returns
 */
const List = (props: {
  list?: any[] | undefined;
  allPraise?: any[] | undefined;
  allAttention?: any[] | undefined;
  allFavorites?: any[] | undefined;
  praise?: any;
  favorite?: any;
  column?: number | undefined;
  userInfo?: any;
  onLike?: (value: boolean, id: string, index: number) => void;
  onCollect?: (value: boolean, id: string, index: number) => void;
  onAttention?: (value: boolean, creator: any, index: number) => void;
  [key: string]: any;
}) => {
  const {
    list = [],
    allPraise = [],
    allAttention = [],
    allFavorites = [],
    praise = {},
    favorite = {},
    column = 5,
    userInfo = {},
    onLike = () => {},
    onCollect = () => {},
    onAttention = () => {},
  } = props;
  const pcWorksListRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(1224);
  const [boxHeight, setBoxHeight] = useState(0);
  const splitWidth = 20;
  const splitHeight = 20;

  const renderItems = () => {
    let maxHeight = 0;
    columnHeightArr = [];
    const itemsArr = list.map((item: any, index: number) => {
      const { _id, imgs = [], content, title, creator = {} } = item;
      const { urlMin, imgWidth, imgHeight } = imgs[0] || {};
      const width = (boxWidth - splitWidth * (column - 1)) / column;
      const height = (width * imgHeight) / imgWidth;
      const infoWidth = width;
      const infoHeight = 88;
      const boxWidth2 = width;
      const boxHeight = height + infoHeight;
      let top = 0;
      let left = 0;
      if (index < column) {
        top = 0;
        left = (width + splitWidth) * (index % column);
        columnHeightArr.push(boxHeight + splitHeight);
      } else {
        let findMinHeightIndex = 0;
        let minHeight = 0;
        for (let i = 0; i < columnHeightArr.length; i++) {
          const columnH = columnHeightArr[i];
          if (i === 0) {
            minHeight = columnH;
            findMinHeightIndex = i;
          } else if (columnH < minHeight) {
            minHeight = columnH;
            findMinHeightIndex = i;
          }
        }
        top = minHeight;
        left = (width + splitWidth) * (findMinHeightIndex % column);
        columnHeightArr[findMinHeightIndex] += boxHeight + splitHeight;
      }
      maxHeight = columnHeightArr.reduce((acc, cur) => {
        return cur > acc ? cur : acc;
      }, 0);
      const isLike = allPraise.findIndex((id) => id === _id) !== -1;
      const isCollect = allFavorites.findIndex((id) => id === _id) !== -1;
      const isAttention =
        allAttention.findIndex((id) => id === creator?._id) !== -1;
      const showAttention = userInfo?._id !== creator?._id;
      return (
        <WorksItem
          key={_id}
          id={_id}
          count={imgs.length}
          url={urlMin}
          title={title}
          content={content}
          boxWidth={boxWidth2}
          boxHeight={boxHeight}
          imgWidth={width}
          imgHeight={height}
          infoWidth={infoWidth}
          infoHeight={infoHeight}
          top={top}
          left={left}
          creator={creator}
          isLike={isLike}
          isCollect={isCollect}
          isAttention={isAttention}
          onLike={() => onLike(!isLike, item._id, index)}
          onCollect={() => onCollect(!isCollect, item._id, index)}
          onAttention={() => onAttention(!isAttention, item?.creator, index)}
          showAttention={showAttention}
          likeCount={praise[_id]}
          collectionCount={favorite[_id]}
        />
      );
    });
    if (boxHeight !== maxHeight) {
      setBoxHeight(maxHeight);
    }
    return itemsArr;
  };

  useEffect(() => {
    const workListElement = document.querySelector(`.${styles.worksListBox}`);
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setBoxWidth(width);
      }
    });
    if (workListElement) {
      resizeObserver.observe(workListElement);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={pcWorksListRef}
      className={styles.worksListBox}
      style={{ height: boxHeight }}
    >
      {renderItems()}
    </div>
  );
};

export default List;
