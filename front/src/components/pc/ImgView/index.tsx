import React from 'react';
import styles from './styles.less';
import Sudoku from '@/components/pc/Sudoku';
import Img from '@/components/pc/Img';

interface Props {
  data?: any[];
  style?: React.CSSProperties;
}

/**
 * 图片组展示组件，图片数量大于1的时候展示方式为9宫格，
 */
const ImgView: React.FC<Props> = ({ data = [], style }) => {
  return data.length > 0 ? (
    <div style={style}>
      {data.length > 1 ? <Sudoku data={data} /> : <Img data={data[0]} />}
    </div>
  ) : null;
};

export default ImgView;
