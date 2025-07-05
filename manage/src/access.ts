export default function access(initialState: { currentUser?: API.UserInfo | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser?.authority === '1',
  };
}
