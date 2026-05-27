export interface ShareData {
    title: string;
    message?: string;
    url: string;
    icon?: string;
}
export type ShareTarget = 'default' | 'wechatFriend' | 'wechatTimeline' | 'qqFriend' | 'qZone' | 'weibo';
export type ShareResult = {
    success: boolean;
    method?: string;
    message?: string;
    cancelled?: boolean;
    error?: string;
};
export type ShareNotify = (msg: string) => void;
export interface WechatJssdkConfig {
    appId: string;
    timestamp: number;
    nonceStr: string;
    signature: string;
    [key: string]: unknown;
}
