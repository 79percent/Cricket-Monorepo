declare namespace API {
  type UserInfo = {
    _id: string | React.Key;
    name: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    authority: string;
  };
}
