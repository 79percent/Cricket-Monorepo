import video1 from '@/assets/video/video1.mp4';
import video2 from '@/assets/video/video2.mp4';
import video3 from '@/assets/video/video3.mp4';
import video4 from '@/assets/video/video4.mp4';
import video5 from '@/assets/video/video5.mp4';
import video6 from '@/assets/video/video6.mp4';
import video7 from '@/assets/video/video7.mp4';

/**
 * 随机生成关键帧动画
 * @returns
 */
const createKeyframes = () => {
  const firstX = `${-2 + Math.random() * 25}px`;
  const firstY = `${-2 + Math.random() * 25}px`;
  const keyframes = [{ translateX: firstX, translateY: firstY }];
  for (let index = 0; index < 8; index++) {
    keyframes.push({
      translateX: `${-2 + Math.random() * 25}px`,
      translateY: `${-2 + Math.random() * 25}px`,
    });
  }
  keyframes.push(
    {
      translateX: firstX,
      translateY: firstY,
    },
    {
      translateX: '0',
      translateY: '0',
    },
  );
  return keyframes;
};

/**
 * 视频列表
 */
export const videoList = [
  {
    src: video1,
    width: 235,
    height: 235,
    top: '28%',
    left: '0',
    keyframes: createKeyframes(),
  },
  {
    src: video2,
    width: 126,
    height: 126,
    top: '70%',
    left: '18%',
    keyframes: createKeyframes(),
  },
  {
    src: video3,
    width: 271,
    height: 271,
    top: '32%',
    left: '30%',
    keyframes: createKeyframes(),
  },
  {
    src: video4,
    width: 145,
    height: 145,
    top: '3%',
    left: '48%',
    keyframes: createKeyframes(),
  },
  {
    src: video5,
    width: 145,
    height: 145,
    top: '19%',
    left: '68%',
    keyframes: createKeyframes(),
  },
  {
    src: video6,
    width: 100,
    height: 100,
    top: '40%',
    left: '88%',
    keyframes: createKeyframes(),
  },
  {
    src: video7,
    width: 200,
    height: 200,
    top: '50%',
    left: '64%',
    keyframes: createKeyframes(),
  },
];
