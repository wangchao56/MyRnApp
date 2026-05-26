import { defineConfig } from 'vitepress';

const repository = process.env.GITHUB_REPOSITORY;
const repoName = repository?.split('/')[1] ?? 'MyRnApp';
const githubUrl = repository ? `https://github.com/${repository}` : undefined;
const defaultBase = process.env.GITHUB_ACTIONS ? `/${repoName}/` : '/';

export default defineConfig({
  lang: 'zh-CN',
  title: 'MyRnApp',
  description: 'MyRnApp 跨端 Monorepo 项目文档（React Native · Nx · pnpm）',
  base: process.env.BASE_PATH ?? defaultBase,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: '文档首页', link: '/README' },
      { text: '快速开始', link: '/B05-开发环境安装与配置' },
      { text: 'JSBridge', link: '/JSBridge-Loading-Usage' },
      ...(githubUrl ? [{ text: 'GitHub', link: githubUrl }] : []),
    ],

    sidebar: [
      {
        text: '开始',
        collapsed: false,
        items: [
          { text: '文档索引', link: '/README' },
          { text: '开发环境安装与配置', link: '/B05-开发环境安装与配置' },
          { text: '安装命令', link: '/B01-安装命令' },
          { text: '开发调试', link: '/B02-开发调试' },
          ...(githubUrl
            ? [{ text: 'Apps 目录说明', link: `${githubUrl}/blob/main/apps/README.md` }]
            : []),
        ],
      },
      {
        text: '架构与构建',
        items: [
          { text: '项目架构', link: '/A01-项目架构' },
          { text: '打包构建', link: '/A02-打包构建' },
          { text: 'Web 产物打包', link: '/A03-Web产物打包' },
          { text: '各大版本之间的区别', link: '/A04-各大版本之间的区别' },
          { text: 'RN 0.77 迁移指南', link: '/A05-RN077迁移指南' },
          { text: '全平台主动分享方案', link: '/A06-全平台主动分享方案' },
          { text: '全平台 Toast 组件', link: '/A07-全平台 Toast 组件设计与开发方案' },
          { text: 'Nx 使用指南', link: '/B04-Nx使用指南' },
        ],
      },
      {
        text: '开发实践',
        items: [
          { text: 'RNW 与 RN 原生对比', link: '/B03-RNW与RN原生对比' },
          { text: 'Android 测试指南', link: '/Android测试指南' },
          { text: 'Android 环境问题修复', link: '/Android环境问题修复指南' },
          { text: '运行 pnpm android 报错', link: '/BUG01-运行pnpm android命令报错' },
          { text: 'ReactNativeWebView 优化', link: '/ReactNativeWebView优化指南' },
          { text: '立即测试指南', link: '/立即测试指南' },
          { text: '快速测试卡片', link: '/快速测试卡片' },
          { text: '完整测试场景', link: '/完整测试场景' },
        ],
      },
      {
        text: 'UI 与组件',
        items: [
          { text: 'UI 设计规范', link: '/D01-UI设计规范' },
          { text: 'SafeAreaView Web 行为', link: '/D01-📱 SafeAreaView 在 Web 端的行为' },
          { text: '主题化 StyleSheet', link: '/D02-主题化StyleSheet' },
          { text: '主题化 StyleSheet 优化规划', link: '/D03-主题化StyleSheet优化规划' },
          { text: 'App/H5 主题化优化规划', link: '/D03-AppH5主题化优化规划' },
          { text: '通用图片组件', link: '/D04-通用图片组件' },
          { text: 'Gradient 渐变组件', link: '/D05-Gradient渐变组件' },
          { text: 'SvgIcon 图标组件', link: '/D06-SvgIcon图标组件' },
          { text: '组件封装规范', link: '/D07-组件封装规范' },
        ],
      },
      {
        text: 'JSBridge 与能力',
        items: [
          { text: 'JSBridge Loading 用法', link: '/JSBridge-Loading-Usage' },
          { text: 'JSBridge 进阶功能', link: '/jsbridge/B04-JSBridge进阶功能指南' },
          { text: '剪贴板功能', link: '/E01-剪贴板功能' },
          { text: '扫码 / 相机方案', link: '/S01-扫码/相机解决方案' },
          { text: '支付解决方案', link: '/Z01-支付解决方案' },
          { text: '应用内购买', link: '/C01-应用内购买' },
          { text: '媒体保存功能总结', link: '/媒体保存功能总结' },
          ...(githubUrl
            ? [{ text: 'JSBridge SDK README', link: `${githubUrl}/blob/main/packages/jsbridge/README.md` }]
            : []),
        ],
      },
      {
        text: 'iOS / CocoaPods',
        items: [
          { text: 'iOS 开发指南', link: '/I01-iOS开发指南' },
          { text: 'iOS 快速参考', link: '/I02-iOS快速参考' },
          { text: 'CocoaPods 是什么', link: '/C02-📦 CocoaPods 是什么' },
          { text: 'CocoaPods 安装指南', link: '/C03-📦 CocoaPods 安装指南' },
        ],
      },
    ],

    socialLinks: githubUrl ? [{ icon: 'github', link: githubUrl }] : [],

    footer: {
      message: 'MyRnApp Monorepo 文档',
      copyright: repository ? `Copyright © ${repository.split('/')[0]}` : 'Copyright © MyRnApp',
    },

    search: {
      provider: 'local',
    },

    outline: {
      level: [2, 3],
    },
  },
});
