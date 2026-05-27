import type { ShareData, ShareResult, ShareTarget } from '../types';
export declare function shareOptionsToShareData(options: {
    title: string;
    desc?: string;
    link: string;
    imgUrl?: string;
}): ShareData;
export declare function shareWeb(data: ShareData, target?: ShareTarget): Promise<ShareResult>;
