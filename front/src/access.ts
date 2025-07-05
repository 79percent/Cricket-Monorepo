export default function access(initialState: {
  currentUser: any;
  isMobile: boolean;
}) {
  const { currentUser, isMobile } = initialState || {};
  return {
    canLogin: !!currentUser,
    canMobile: isMobile,
    canPC: !isMobile,
    canAdmin: currentUser?.authority === '1',
  };
}
