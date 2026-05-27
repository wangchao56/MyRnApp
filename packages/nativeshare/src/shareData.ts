import {
  getContentFromDescTag,
  getHrefFromIconTag,
  getTitleFromTitleTag,
  noop,
} from './utils';
import type { NativeShareData } from './types';

export const defaultShareData: NativeShareData = {
  link: typeof location !== 'undefined' ? location.href : '',
  title: getTitleFromTitleTag(),
  desc: getContentFromDescTag(),
  icon: getHrefFromIconTag(),
  from: '',
  success: noop,
  fail: noop,
  trigger: noop,
};
