import React, { useRef, useState, FC } from 'react';
import { Link } from 'umi';
import { Spin, Image, Avatar } from 'antd';
import styles from './styles.less';
import qs from 'qs';
import guoqi from '@/assets/icon/D-tupianguoqi1.svg';
import IconFont from '@/components/pc/IconFont';
import { UserOutlined } from '@ant-design/icons';

interface Props {
  /** 数据源 */
  data: any[];
  /** 数据加载状态 */
  loading?: boolean;
  /** 是否有更多数据 */
  hasMore?: boolean;
  /** 标题 */
  title?: string;
  /** 是否展示底部 */
  showFooter?: boolean;
  /** 是否展示用户 */
  showCreator?: boolean;
  /** 无数据时的文本 */
  emptyText?: string;
}

/**
 * 推荐作品列表
 * @param param0
 */
const RecommendList: FC<Props> = ({
  data = [],
  loading = false,
  hasMore = false,
  title = '',
  showFooter = false,
  showCreator = true,
  emptyText = '',
}) => {
  const listBoxRef = useRef<HTMLDivElement>(null);
  const [listBoxWidth, setListBoxWidth] = useState(1224);
  const columsNumber = 6; // 列数
  const rowsNumber = Math.ceil(data.length / columsNumber); // 行数
  const splitNumber = 24; // 分隔间距
  const imgWidth = // 图片宽
    (listBoxWidth - splitNumber * (columsNumber - 1)) / columsNumber;
  const imgHeight = imgWidth; // 图片高度
  const titleHeight = 22 + 4; // 标题高度
  const creatorHeight = showCreator ? 24 + 4 : 0; // 创建者高度
  const itemWidth = imgWidth; // 盒子宽度
  const itemHeight = imgHeight + titleHeight + creatorHeight; // 盒子高度

  const renderList = () => {
    return data?.map((item, index) => {
      const { imgs = [], _id, title, creator, content } = item;
      const { urlMin = '' } = imgs[0] || {};
      const href = `/pc/detail?${qs.stringify({ id: _id })}`;
      const href2 = `/pc/space?${qs.stringify({ id: creator?._id })}`;
      return (
        <div key={_id} className={styles.item}>
          <div
            style={{
              width: imgWidth,
              height: imgHeight,
              position: 'relative',
            }}
          >
            <Link
              to={href}
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            >
              <Image
                width={imgWidth}
                height={imgHeight}
                alt={content || title}
                preview={false}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                src={urlMin}
                fallback={guoqi}
                className={styles.img}
              />
            </Link>
            {imgs.length > 1 && (
              <div className={styles.imgCount}>
                <IconFont
                  type="icon-tupianjihe"
                  style={{ fontSize: 18, color: '#fff' }}
                />
                <span className={styles.imgCountNum}>{imgs.length}</span>
              </div>
            )}
          </div>
          <div className={styles.titleRow}>
            <Link
              to={href}
              className={styles.title}
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            >
              {title || '无题'}
            </Link>
          </div>
          {showCreator && (
            <div className={styles.creatorRow}>
              <Link
                to={href2}
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                <Avatar
                  size={24}
                  icon={!creator?.avatar && <UserOutlined />}
                  src={creator?.avatar}
                />
              </Link>
              <Link
                to={href2}
                className={styles.name}
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                {creator?.name}
              </Link>
            </div>
          )}
        </div>
      );
    });
  };

  // useEffect(() => {
  //   setListBoxWidth(listBoxRef.current?.clientWidth || 0);
  // }, []);

  return (
    <section className={styles.pcRecommendList}>
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
      )}
      {data.length === 0 ? (
        <div className={styles.emptyBox}>{emptyText}</div>
      ) : (
        <div
          className={styles.listBox}
          ref={listBoxRef}
          style={{
            gridTemplateRows: `repeat(${rowsNumber}, ${itemHeight}px)`,
            gridTemplateColumns: `repeat(${columsNumber}, ${itemWidth}px)`,
            gridGap: '24px 24px',
          }}
        >
          {renderList()}
        </div>
      )}

      {loading && (
        <div className={styles.spinBox}>
          <Spin spinning={loading} />
        </div>
      )}
      {showFooter && (
        <div className={styles.spinBox}>
          {!hasMore && <span className={styles.last}>没有更多了~</span>}
        </div>
      )}
    </section>
  );
};

export default RecommendList;
