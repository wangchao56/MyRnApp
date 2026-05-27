import { openAppByScheme, generateQueryString, Base64, isIos } from './utils';
import { defaultShareData } from './shareData';

function generateQQQueryString(data: typeof defaultShareData): string {
  return generateQueryString({
    share_id: '924053302',
    url: Base64.encode(data.link),
    title: Base64.encode(data.title),
    description: Base64.encode(data.desc),
    previewimageUrl: Base64.encode(data.icon),
    image_url: Base64.encode(data.icon),
  });
}

export function shareToQQ(): void {
  const shareScheme = isIos
    ? 'mqqapi://share/to_fri?src_type=web&version=1&file_type=news'
    : 'mqqapi://share/to_fri?src_type=isqqBrowser&version=1&file_type=news';
  openAppByScheme(`${shareScheme}&${generateQQQueryString(defaultShareData)}`);
}

export function shareToQZone(): void {
  const shareScheme = isIos
    ? 'mqqapi://share/to_fri?file_type=news&src_type=web&version=1&generalpastboard=1&shareType=1&cflag=1&objectlocation=pasteboard&callback_type=scheme&callback_name=QQ41AF4B2A'
    : 'mqqapi://share/to_qzone?src_type=isqqBrowser&version=1&file_type=news&req_type=1';
  openAppByScheme(`${shareScheme}&${generateQQQueryString(defaultShareData)}`);
}

export function shareToQZone4Web(): void {
  const queryObj = {
    url: defaultShareData.link,
    title: defaultShareData.title,
    pic: defaultShareData.icon,
    desc: defaultShareData.desc,
  };
  location.href = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?${generateQueryString(queryObj, true)}`;
}

export function shareToWeibo4Web(): void {
  const queryObj = {
    url: defaultShareData.link,
    title: defaultShareData.title,
    pic: defaultShareData.icon,
  };
  location.href = `http://service.weibo.com/share/share.php?${generateQueryString(queryObj, true)}`;
}
