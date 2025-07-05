import React, { useEffect } from 'react';
import { Button, Cell, CellGroup } from 'tdesign-mobile-react';
import styles from './styles.less';
import {
  connect,
  Link,
  useModel,
  useDispatch,
  history,
  LoginModelState,
  HomeModelState,
  HeaderModelState,
  TagsModelState,
  Dispatch,
  SpaceModelState,
  MobileMenuModelState,
} from 'umi';
import {
  Search,
  BackTop,
  PullDownRefresh,
  Toast,
  Avatar,
} from 'tdesign-mobile-react';
import {
  ThumbUpIcon,
  ChevronRightIcon,
  UserCircleIcon,
  SettingIcon,
  ImageIcon,
  LockOnIcon,
  MailIcon,
  ServiceIcon,
  ChartBubbleIcon,
  HeartIcon,
} from 'tdesign-icons-react';
import IconFont from '@/components/pc/IconFont';

interface Props {
  dispatch: Dispatch;
  header: HeaderModelState;
  login: LoginModelState;
  tags: TagsModelState;
  space: SpaceModelState;
  mobileMenu: MobileMenuModelState;
}

const Menu: React.FC<Props> = (props) => {
  const { setInitialState, initialState } = useModel('@@initialState');
  const dispatch = useDispatch();
  const userInfo = initialState?.currentUser || {};
  const { location } = history;
  const { query } = location;
  const { id } = query as { id: string };
  const { space, mobileMenu } = props;
  const { statistics } = mobileMenu;
  const { contributeCount, attentionCount, favoriteCount } = statistics;

  /**
   * 退出登录
   */
  const loginOut = async () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user_info');
    sessionStorage.removeItem('all_praise');
    sessionStorage.removeItem('all_attention');
    sessionStorage.removeItem('all_favorites');
    await dispatch({
      type: 'login/loginOut',
    });
    await setInitialState({
      ...initialState,
      currentUser: undefined,
      allPraise: undefined,
      allAttention: undefined,
      allFavorites: undefined,
    } as any);
    history.push('/login');
  };

  const UserAvatar = (
    <Link to={`/mb/space?id=${id}`}>
      <div className={styles.mbMenuSpace}>
        <div className={styles.spaceLeft}>
          <Avatar
            size="8rem"
            image={userInfo.avatarMin}
            icon={
              userInfo.avatarMin || (
                <UserCircleIcon
                  size="8rem"
                  style={{
                    color: '#b5b5b5',
                  }}
                />
              )
            }
          />
        </div>
        <div className={styles.spaceCenter}>
          <div className={styles.spaceTitle}>{userInfo.name}</div>
          <div className={styles.spaceProfile}>
            {userInfo.profile && userInfo.profile.trim()
              ? userInfo.profile.trim()
              : '暂无简介'}
          </div>
        </div>
        <div className={styles.spaceRight}>
          <div className={styles.spaceRightText}>个人空间</div>
          <ChevronRightIcon
            size="3rem"
            style={{
              color: '#929292',
            }}
          />
        </div>
      </div>
    </Link>
  );

  useEffect(() => {
    if (!id) {
      return;
    }
    dispatch({
      type: 'mobileMenu/fetchUserStatisticsAPI',
      payload: {
        id,
      },
    });
  }, [id]);

  const CountStatistic = () => (
    <div className={styles.mbMenuCount}>
      <div className={styles.mbMenuCountItem}>
        {/* <ChartBubbleIcon size="3rem" style={{ color: '#8462bb' }} /> */}
        <Link to={`/mb/space?id=${id}`}>
          <span className={styles.count}>{contributeCount}</span>
        </Link>
        <Link to={`/mb/space?id=${id}`}>
          <div className={styles.mbMenuCountText}>动态</div>
        </Link>
      </div>
      <div className={styles.mbMenuCountItem}>
        {/* <ThumbUpIcon size="3rem" style={{ color: '#ccc' }} /> */}
        <Link to={`/mb/space?id=${id}`}>
          <span className={styles.count}>{attentionCount}</span>
        </Link>
        <Link to={`/mb/space?id=${id}`}>
          <div className={styles.mbMenuCountText}>关注</div>
        </Link>
      </div>
      <div className={styles.mbMenuCountItem}>
        {/* <HeartIcon size="3rem" style={{ color: 'red' }} /> */}
        <Link to={`/mb/space?id=${id}`}>
          <span className={styles.count}>{favoriteCount}</span>
        </Link>
        <Link to={`/mb/space?id=${id}`}>
          <div className={styles.mbMenuCountText}>收藏</div>
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ margin: '2rem 0' }}>
      <CellGroup style={{ marginBottom: '4rem' }}>
        <Cell
          title={userInfo.name}
          description={
            userInfo.profile && userInfo.profile.trim()
              ? userInfo.profile.trim()
              : '暂无简介'
          }
          image={
            <img
              src={userInfo.avatarMin}
              width={60}
              height={60}
              style={{ borderRadius: '50%' }}
            />
          }
          arrow
          note="个人空间"
          hover
          url={`/mb/space?id=${id}`}
        />
        <CountStatistic />
        <Cell
          title="上传图片"
          arrow
          leftIcon={<ImageIcon />}
          url="/mb/publish"
        />
        <Cell
          title="个人设置"
          arrow
          leftIcon={<SettingIcon />}
          url="/mb/setting"
        />
        <Cell
          title="修改密码"
          arrow
          leftIcon={<LockOnIcon />}
          url="/mb/setPassword"
        />
        <Cell
          title="更换邮箱"
          arrow
          leftIcon={<MailIcon />}
          url="/mb/setEmail"
        />
        <Cell
          title="意见反馈"
          arrow
          leftIcon={<ServiceIcon />}
          url="/mb/feedback"
        />
      </CellGroup>
      <div className={styles.buttonRow}>
        <Button
          size="large"
          theme="danger"
          shape="rectangle"
          block
          style={{ marginBottom: '2rem', width: '26rem' }}
          onClick={() => {
            loginOut();
          }}
        >
          退出登录
        </Button>
      </div>
    </div>
  );
};

export default connect(
  ({
    header,
    login,
    tags,
    space,
    mobileMenu,
  }: {
    header: HeaderModelState;
    login: LoginModelState;
    tags: TagsModelState;
    space: SpaceModelState;
    mobileMenu: MobileMenuModelState;
  }) => ({
    header,
    login,
    tags,
    space,
    mobileMenu,
  }),
)(Menu);
