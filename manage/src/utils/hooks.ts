import React, { useEffect } from 'react';
import _ from 'lodash';

/**
 * 触发滚动到底部时的hook
 */
export const useScrollEnd = (onScrollEnd: () => void, delay: number = 300) => {
  useEffect(() => {
    const handleScroll = _.debounce(() => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      //变量windowHeight是可视区的高度
      const windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      //变量scrollHeight是滚动条的总高度
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const totalHeight = Math.ceil(scrollTop + windowHeight);
      //滚动条到底部的条件
      if (totalHeight >= scrollHeight && typeof onScrollEnd === 'function') {
        onScrollEnd();
      }
    }, delay);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScrollEnd, delay]);
};

/**
 * 触发浏览器窗口大小变化的hook
 */
export const useWindowResize = (onResize: () => void) => {
  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);
};
