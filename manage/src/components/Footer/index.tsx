import { DefaultFooter } from '@ant-design/pro-layout';
export default () => {
  const defaultMessage = 'Cricket 后台管理系统';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'transparent',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[]}
    />
  );
};
