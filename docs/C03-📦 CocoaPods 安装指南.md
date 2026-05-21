用户询问如何单独安装 CocoaPods。这是一个关于 iOS 开发工具的问题，我需要提供详细的安装步骤。

CocoaPods 是 iOS/macOS 的依赖管理工具，需要在 macOS 系统上安装。安装步骤通常包括：

1. 确保安装了 Ruby（macOS 默认安装）
2. 使用 gem 安装 CocoaPods
3. 可能需要处理权限问题
4. 配置镜像（针对国内用户）

让我提供详细的安装指南。

# 📦 单独安装 CocoaPods 指南

## 🚀 安装步骤

### 方法 1：使用 RubyGems 安装（推荐）

```bash
# 1. 更新 RubyGems
sudo gem update --system

# 2. 安装 CocoaPods（需要管理员权限）
sudo gem install cocoapods

# 3. 验证安装
pod --version
```

### 方法 2：使用 Homebrew 安装

```bash
# 1. 确保 Homebrew 已安装
brew --version

# 如果未安装，先安装 Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. 使用 Homebrew 安装 CocoaPods
brew install cocoapods
```

---

## ⚠️ 常见问题解决

### 问题 1：权限问题

```bash
# 如果遇到权限错误，尝试：
sudo gem install cocoapods -n /usr/local/bin

# 或使用 --user-install
gem install cocoapods --user-install
```

### 问题 2：网络问题（国内用户）

```bash
# 使用 Ruby China 镜像
gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/

# 查看当前源
gem sources -l

# 安装
gem install cocoapods
```

### 问题 3：M1/M2 芯片问题

```bash
# 方案 1：使用 Rosetta 终端
arch -x86_64 sudo gem install cocoapods

# 方案 2：使用 Homebrew（推荐）
brew install cocoapods

# 方案 3：设置环境变量
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
gem install cocoapods
```

---

## 📋 安装后配置

### 1. 设置 CocoaPods 仓库

```bash
# 首次安装后需要设置
pod setup

# 查看仓库状态
pod repo list
```

### 2. 更新本地仓库

```bash
# 定期更新
pod repo update

# 或在执行 pod install 时更新
pod install --repo-update
```

---

## 🎯 验证安装

```bash
# 检查版本
pod --version

# 查看帮助
pod --help

# 查看命令列表
pod commands
```

---

## 📊 安装状态检查

```bash
# 检查安装路径
which pod
# 输出：/usr/local/bin/pod

# 检查 Ruby 版本（需要 2.6+）
ruby --version
```

---

## 🚀 在项目中使用

```bash
# 进入 iOS 目录
cd ios

# 初始化 Podfile（如果没有）
pod init

# 安装依赖
pod install

# 打开项目（使用 .xcworkspace 文件）
open MyApp.xcworkspace
```

---

## ❌ 卸载 CocoaPods

```bash
# 卸载
sudo gem uninstall cocoapods

# 移除相关组件
sudo gem uninstall cocoapods-core cocoapods-downloader cocoapods-plugins
```

---

## 📝 总结

| 操作              | 命令                         |
| ----------------- | ---------------------------- |
| **安装**          | `sudo gem install cocoapods` |
| **Homebrew 安装** | `brew install cocoapods`     |
| **验证版本**      | `pod --version`              |
| **初始化项目**    | `pod init`                   |
| **安装依赖**      | `pod install`                |
| **更新依赖**      | `pod update`                 |

安装完成后，就可以在 React Native 项目的 `ios` 目录下使用 `pod install` 来安装原生依赖了！
