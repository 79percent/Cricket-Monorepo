import React, { useEffect } from 'react';
import styles from './styles.less';
import { videoList } from '../../utils';
import anime from 'animejs';

const VideoBox = () => {
  useEffect(() => {
    videoList.forEach((item, index) => {
      const id = `#pc-video-item-${index}`;
      const { keyframes = [] } = item;
      anime({
        targets: id,
        keyframes,
        duration: 20000,
        easing: 'linear',
        loop: true,
      });
    });
    return () => {
      videoList.forEach((item, index) => {
        const id = `#pc-video-item-${index}`;
        anime.remove(id);
      });
    };
  }, []);

  return (
    <div className={styles.pcVideoBox}>
      {videoList.map((item, index) => {
        const { src, width, height, top, left } = item;
        return (
          <div
            key={src}
            id={`pc-video-item-${index}`}
            className={styles.videoBox}
            style={{
              width,
              height,
              top,
              left,
              position: 'absolute',
            }}
          >
            <video autoPlay={true} loop={true} muted={true}>
              <source src={src} type="video/mp4" />
            </video>
          </div>
        );
      })}
    </div>
  );
};

export default VideoBox;
