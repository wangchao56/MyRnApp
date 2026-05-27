# @myapp/share

全平台统一分享 API，供 React Native 与 Web 业务层调用。

## 使用

```tsx
import { share } from '@myapp/share';

await share({
  title: '邀请你加入',
  message: '快来体验',
  url: 'https://myapp.com/invite',
  icon: 'https://myapp.com/logo.png',
}, 'wechatFriend');
```

## 微信 JSSDK（Web）

在应用入口注入签名提供者，勿在包内写死接口地址：

```ts
import { setWechatConfigProvider, setShareNotify, setupDefaultShare } from '@myapp/share';

// 方式一：自定义
setWechatConfigProvider(async (url) => { /* fetch 签名 */ });
setShareNotify((msg) => { /* Toast / Alert */ });

// 方式二：默认 /api/wechat-jssdk-config
setupDefaultShare({ onNotify: (msg) => alert(msg) });
```

## 依赖

- `react-native-share`（iOS / Android）
- `@react-native-clipboard/clipboard`
- `@myapp/nativeshare`（Web 内置浏览器，workspace ESM）

## 构建（ESM）

```bash
pnpm --filter @myapp/nativeshare run build
pnpm --filter @myapp/share run build
```

`@myapp/share` 的 `web.ts` 通过 ESM 引入 `@myapp/nativeshare`：

```ts
import NativeShare from '@myapp/nativeshare';
```

子路径导出：`@myapp/share/web`、`@myapp/share/types`。
