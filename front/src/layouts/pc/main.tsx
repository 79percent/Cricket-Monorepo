import React, { useEffect } from 'react';
import styles from './main.less';
import Header from '@/components/pc/Header';
import Footer from '@/components/pc/Footer';
import SiderBeian from '@/components/pc/SiderBeian';
import { history, connect, Dispatch } from 'umi';

interface Props {
  dispatch: Dispatch;
}

const PCMain: React.FC<Props> = ({ dispatch, children }) => {
  const { location } = history;
  const { pathname, query } = location;
  const isFullPage = pathname === '/pc/home' || pathname === '/pc/space';
  const isPChome = pathname === '/pc/home';

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
    history.push(`/pc/home${keyword ? `?keyword=${keyword}` : ''}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.pcMain}>
      <Header onSearch={handleSearch} />
      <section
        className={styles.pcContent}
        style={{ width: isFullPage ? '100%' : 1224 }}
      >
        {children}
      </section>
      <Footer />
      {isPChome && <SiderBeian />}
    </div>
  );
};

export default connect(() => ({}))(PCMain);
