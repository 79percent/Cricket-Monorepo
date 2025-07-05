import { createFromIconfontCN } from '@ant-design/icons';
import iconfont from '@/assets/iconfont/iconfont';

/**
 * 自定义图标组件
 * 阿里图标库
 */
const IconFont = createFromIconfontCN({
  scriptUrl: iconfont,
});

/**
 * Use
 * <IconFont type="icon-tuichu" />
 */

export default IconFont;
