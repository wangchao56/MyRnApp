const UA = typeof navigator !== 'undefined' ? navigator.userAgent : '';

export const isIpad = /(iPad).*OS\s([\d_]+)/.test(UA);
export const isIpod = /(iPod)(.*OS\s([\d_]+))?/.test(UA);
export const isIphone = !isIpad && /(iPhone\sOS)\s([\d_]+)/.test(UA);
export const isIos = isIpad || isIpod || isIphone;
export const isAndroid = /(Android);?[\s/]+([\d.]+)?/.test(UA);
export const isWindowsWechat = /windowswechat/i.test(UA);
export const isWechat = /micromessenger/i.test(UA) && !isWindowsWechat;
export const isQQ = /QQ\/([\d.]+)/.test(UA);
export const isQZone = /Qzone\//.test(UA);
export const isQQMBrowser = /MQQBrowser/i.test(UA) && !isWechat && !isQQ;
export const isUCMBrowser = /UCBrowser/i.test(UA);
export const isBaiduMBrowser = /mobile.*baidubrowser/i.test(UA);
export const isSogouMBrowser = /SogouMobileBrowser/i.test(UA);
export const isBaiduApp = /baiduboxapp/i.test(UA);

export function noop(): void {}

export function loadJs(src: string, callback: () => void = noop): void {
  const ref = document.getElementsByTagName('script')[0];
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  ref.parentNode?.insertBefore(script, ref);
  script.onload = callback;
}

export function assign<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  const to = Object(target) as T;
  for (const nextSource of sources) {
    if (nextSource != null) {
      for (const key of Object.keys(nextSource) as (keyof T)[]) {
        (to as Record<string, unknown>)[key as string] = (
          nextSource as Record<string, unknown>
        )[key as string];
      }
    }
  }
  return to;
}

export function openAppByScheme(scheme: string): void {
  if (isIos) {
    location.href = scheme;
  } else {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = scheme;
    document.body.appendChild(iframe);
    setTimeout(() => {
      iframe?.parentNode?.removeChild(iframe);
    }, 2000);
  }
}

export function generateQueryString(
  queryObj: Record<string, string>,
  needEncode = false,
): string {
  const arr: string[] = [];
  for (const key in queryObj) {
    if (needEncode) {
      arr.push(`${key}=${encodeURIComponent(queryObj[key])}`);
    } else {
      arr.push(`${key}=${queryObj[key]}`);
    }
  }
  return arr.join('&');
}

export const Base64 = {
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  encode(input: string): string {
    let output = '';
    let i = 0;
    const encoded = Base64._utf8_encode(input);
    while (i < encoded.length) {
      const b = encoded.charCodeAt(i++);
      const c = encoded.charCodeAt(i++);
      const d = encoded.charCodeAt(i++);
      const e = b >> 2;
      const f = ((3 & b) << 4) | (c >> 4);
      let g = ((15 & c) << 2) | (d >> 6);
      let h = 63 & d;
      if (isNaN(c)) {
        g = h = 64;
      } else if (isNaN(d)) {
        h = 64;
      }
      output +=
        this._keyStr.charAt(e) +
        this._keyStr.charAt(f) +
        this._keyStr.charAt(g) +
        this._keyStr.charAt(h);
    }
    return output;
  },
  _utf8_encode(str: string): string {
    str = str.replace(/\r\n/g, '\n');
    let out = '';
    for (let n = 0; n < str.length; n++) {
      const c = str.charCodeAt(n);
      if (c < 128) {
        out += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        out += String.fromCharCode((c >> 6) | 192, (63 & c) | 128);
      } else {
        out += String.fromCharCode(
          (c >> 12) | 224,
          ((c >> 6) & 63) | 128,
          (63 & c) | 128,
        );
      }
    }
    return out;
  },
};

export function getHostnameFromUrl(url: string): string {
  const a = document.createElement('a');
  a.href = url;
  return a.hostname;
}

const descTag =
  typeof document !== 'undefined'
    ? document.querySelector<HTMLMetaElement>('meta[name=description]')
    : null;
const iconTag =
  typeof document !== 'undefined'
    ? document.querySelector<HTMLLinkElement>('link[rel*=icon]')
    : null;

export function getContentFromDescTag(): string {
  return descTag?.content ?? '';
}

export function getHrefFromIconTag(): string {
  return (
    iconTag?.href ??
    `${location.protocol}//${location.hostname}/favicon.ico`
  );
}

export function getTitleFromTitleTag(): string {
  return typeof document !== 'undefined' ? document.title : '';
}

export function setDescTagContent(content: string): void {
  if (descTag) {
    descTag.content = content;
  } else {
    document.head.insertAdjacentHTML(
      'beforeend',
      `<meta name="description" content="${content}">`,
    );
  }
}

export function setIconTagHref(href: string): void {
  if (iconTag) {
    iconTag.href = href;
  } else {
    document.head.insertAdjacentHTML(
      'beforeend',
      `<link rel="shortcut icon" href="${href}">`,
    );
  }
}

export function setTitleTagTitle(title: string): void {
  document.title = title;
}
