import type { ShareNotify } from './types';

let notifyFn: ShareNotify = (msg: string) => {
  if (typeof window !== 'undefined' && typeof window.alert === 'function') {
    window.alert(msg);
  }
};

export function setShareNotify(fn: ShareNotify): void {
  notifyFn = fn;
}

export function notify(msg: string): void {
  notifyFn(msg);
}
