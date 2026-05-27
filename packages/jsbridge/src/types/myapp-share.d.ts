declare module '@myapp/share/web' {
  import type { ShareData, ShareResult } from '@myapp/share/types';

  export function shareWeb(
    data: ShareData,
    target?: string,
  ): Promise<ShareResult>;

  export function shareOptionsToShareData(options: {
    title: string;
    desc?: string;
    link: string;
    imgUrl?: string;
  }): ShareData;
}

declare module '@myapp/share/types' {
  export interface ShareData {
    title: string;
    message?: string;
    url: string;
    icon?: string;
  }

  export type ShareResult = {
    success: boolean;
    method?: string;
    message?: string;
    cancelled?: boolean;
    error?: string;
  };
}
