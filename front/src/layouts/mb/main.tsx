import React, { useEffect } from 'react';
import TipsInfo from '@/components/mb/TipsInfo';
import styles from './styles.less';
import Header from '@/components/mb/Header';
import Footer from '@/components/pc/Footer';
import { history, connect, Dispatch } from 'umi';

interface Props {
  dispatch: Dispatch;
}

const MobileLayout = (props) => {
  const { route, children, location, dispatch } = props;
  const { routes } = route;
  const { pathname, query } = location;

  useEffect(() => {
    if (query?.keyword) {
      dispatch({
        type: 'header/saveState',
        payload: {
          keyword: query?.keyword,
        },
      });
    }
  }, [query?.keyword]);

  const handleSearch = async (keyword) => {
    history.push(`/mb/home${keyword ? `?keyword=${keyword}` : ''}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.mbBox}>
      <Header onSearch={handleSearch} />
      <section className={styles.mbContent}>{children}</section>
      <Footer />
    </div>
  );
};

export default connect(() => ({}))(MobileLayout);
