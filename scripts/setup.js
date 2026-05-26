#!/usr/bin/env node
/**
 * 全平台开发环境安装与项目依赖初始化（macOS / Linux / Windows）
 *
 * 使用:
 *   pnpm setup
 *   node scripts/setup.js
 *   node scripts/setup.js --skip-system    # 仅装项目依赖 + 生成 .env
 *
 * 平台入口:
 *   bash scripts/setup.sh      (Unix)
 *   pwsh scripts/setup.ps1     (Windows)
 */
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IOS_DIR = path.join(ROOT, 'ios');
const GRADLEW = path.join(ROOT, 'android', 'gradlew');

const isWin = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

const RN_ANDROID = {
  compileSdk: 35,
  buildTools: '35.0.0',
  ndk: '27.1.12297006',
  minJdk: 17,
};

const SDK_PACKAGES = [
  'platform-tools',
  `platforms;android-${RN_ANDROID.compileSdk}`,
  `build-tools;${RN_ANDROID.buildTools}`,
  `ndk;${RN_ANDROID.ndk}`,
];

const args = process.argv.slice(2);
const skipSystem = args.includes('--skip-system');

function log(msg) {
  console.log(msg);
}

function ok(msg) {
  console.log(`  ✓ ${msg}`);
}

function warn(msg) {
  console.warn(`  ! ${msg}`);
}

function info(msg) {
  console.log(`  → ${msg}`);
}

function hasCommand(cmd) {
  try {
    const check = isWin ? `where ${cmd}` : `command -v ${cmd}`;
    execSync(check, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function pathExists(p) {
  if (!p) return false;
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function run(cmd, options = {}) {
  return execSync(cmd, {
    encoding: 'utf8',
    stdio: options.inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
    cwd: options.cwd || ROOT,
    env: { ...process.env, ...options.env },
    shell: isWin,
    ...options,
  });
}

function tryRun(cmd, options = {}) {
  try {
    run(cmd, options);
    return true;
  } catch (e) {
    if (options.verbose) warn(e.message || String(e));
    return false;
  }
}

function getAndroidSdkRoot() {
  const candidates = isWin
    ? [
        process.env.ANDROID_HOME,
        process.env.ANDROID_SDK_ROOT,
        path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk'),
        path.join(process.env.USERPROFILE || '', 'AppData', 'Local', 'Android', 'Sdk'),
      ]
    : [
        process.env.ANDROID_HOME,
        process.env.ANDROID_SDK_ROOT,
        path.join(require('os').homedir(), 'Library', 'Android', 'sdk'),
        path.join(require('os').homedir(), 'Android', 'Sdk'),
      ];
  return candidates.find(p => p && pathExists(p)) || null;
}

function getSdkManagerPath(sdkRoot) {
  if (!sdkRoot) return null;
  const bin = isWin ? 'sdkmanager.bat' : 'sdkmanager';
  const latest = path.join(sdkRoot, 'cmdline-tools', 'latest', 'bin', bin);
  if (pathExists(latest)) return latest;
  const legacy = path.join(sdkRoot, 'tools', 'bin', bin);
  if (pathExists(legacy)) return legacy;
  return null;
}

// ─── 系统级安装 ─────────────────────────────────────────────

function installWithBrew(formula, { cask = false } = {}) {
  if (!hasCommand('brew')) {
    warn('未安装 Homebrew: https://brew.sh');
    return false;
  }
  const sub = cask ? 'install --cask' : 'install';
  info(`brew ${sub} ${formula}`);
  return tryRun(`brew ${sub} ${formula}`, { inherit: true });
}

function installWithWinget(id) {
  if (!hasCommand('winget')) {
    warn('未安装 winget（Windows 10/11 应用商店组件）');
    return false;
  }
  info(`winget install ${id}`);
  return tryRun(
    `winget install -e --id ${id} --accept-package-agreements --accept-source-agreements`,
    { inherit: true },
  );
}

function getLinuxPackageManager() {
  if (hasCommand('apt-get')) return 'apt';
  if (hasCommand('dnf')) return 'dnf';
  if (hasCommand('pacman')) return 'pacman';
  return null;
}

function installWithLinuxPm(packages) {
  const pm = getLinuxPackageManager();
  if (!pm) {
    warn('未识别 Linux 包管理器 (apt/dnf/pacman)');
    return false;
  }
  info(`使用 ${pm} 安装: ${packages.join(' ')}`);
  if (pm === 'apt') {
    return tryRun(`sudo apt-get update && sudo apt-get install -y ${packages.join(' ')}`, {
      inherit: true,
    });
  }
  if (pm === 'dnf') {
    return tryRun(`sudo dnf install -y ${packages.join(' ')}`, { inherit: true });
  }
  if (pm === 'pacman') {
    return tryRun(`sudo pacman -S --noconfirm ${packages.join(' ')}`, { inherit: true });
  }
  return false;
}

function setupNode() {
  log('');
  log('[系统] Node.js (>= 18)');
  if (hasCommand('node')) {
    const ver = run('node -v').trim();
    const major = parseInt(ver.replace(/^v/, ''), 10);
    if (major >= 18) {
      ok(`已安装 ${ver}`);
      return;
    }
    warn(`${ver} 版本过低`);
  }

  if (skipSystem) {
    warn('已跳过安装（--skip-system）');
    return;
  }

  if (isMac) {
    installWithBrew('node@22') && tryRun('brew link node@22 --overwrite --force', { inherit: true });
  } else if (isWin) {
    installWithWinget('OpenJS.NodeJS.LTS');
  } else if (isLinux) {
    installWithLinuxPm(['nodejs', 'npm']) ||
      warn('建议安装 nvm: https://github.com/nvm-sh/nvm');
  }

  if (hasCommand('node')) ok(`Node ${run('node -v').trim()}`);
  else warn('请手动安装 Node 18+: https://nodejs.org/');
}

function setupJdk() {
  log('');
  log('[系统] JDK 17+');
  if (hasCommand('java')) {
    try {
      const out = run('java -version 2>&1');
      ok(out.split('\n')[0]);
    } catch {
      /* continue install */
    }
  }

  if (skipSystem) {
    warn('已跳过安装（--skip-system）');
    return;
  }

  if (isMac) {
    installWithBrew('zulu@17', { cask: true }) || installWithBrew('temurin@17', { cask: true });
  } else if (isWin) {
    installWithWinget('EclipseAdoptium.Temurin.17.JDK') ||
      installWithWinget('Microsoft.OpenJDK.17');
  } else if (isLinux) {
    installWithLinuxPm(['openjdk-17-jdk']) ||
      installWithLinuxPm(['java-17-openjdk-devel']);
  }

  if (!hasCommand('java')) {
    warn('安装后请重新打开终端，并运行: pnpm setup:env');
  }
}

function setupWatchman() {
  log('');
  log('[系统] watchman（可选，提升 Metro）');
  if (hasCommand('watchman')) {
    ok('已安装');
    return;
  }
  if (skipSystem) return;

  if (isMac) {
    installWithBrew('watchman');
  } else if (isLinux) {
    installWithLinuxPm(['watchman']) || warn('可选: https://facebook.github.io/watchman/docs/install');
  } else {
    warn('Windows 可不装 watchman');
  }
}

function setupAndroidSdk() {
  log('');
  log('[系统] Android SDK 组件');
  const sdkRoot = getAndroidSdkRoot();
  if (!sdkRoot) {
    warn('未找到 Android SDK');
    if (isMac) {
      info('请安装 Android Studio: https://developer.android.com/studio');
      installWithBrew('android-commandlinetools', { cask: true });
    } else if (isWin) {
      info('请安装 Android Studio，SDK 默认在 %LOCALAPPDATA%\\Android\\Sdk');
    } else {
      info('请安装 Android Studio 或配置 ANDROID_HOME');
    }
    return;
  }

  ok(`SDK 路径: ${sdkRoot}`);
  const sdkmanager = getSdkManagerPath(sdkRoot);
  if (!sdkmanager) {
    warn('未找到 sdkmanager，请在 Android Studio → SDK Manager 安装:');
    SDK_PACKAGES.forEach(p => log(`      - ${p}`));
    return;
  }

  if (skipSystem) {
    warn('已跳过 sdkmanager 安装（--skip-system）');
    return;
  }

  info('安装 RN 0.77 所需 SDK 包...');
  const pkgList = SDK_PACKAGES.join(' ');
  const yesCmd = isWin ? 'echo y' : 'yes';
  tryRun(`${yesCmd} | "${sdkmanager}" ${pkgList}`, { inherit: true, shell: true }) ||
    tryRun(`"${sdkmanager}" ${pkgList}`, { inherit: true });
}

function setupXcode() {
  if (!isMac) return;
  log('');
  log('[系统] Xcode（iOS 构建）');
  if (hasCommand('xcodebuild')) {
    try {
      const lines = run('xcodebuild -version').trim().split('\n');
      ok(lines[0]);
    } catch {
      ok('xcodebuild 可用');
    }
  } else {
    warn('未安装 Xcode，请从 App Store 安装');
    log('  https://apps.apple.com/app/xcode/id497799835');
  }
}

function setupCocoaPods() {
  if (!isMac) {
    log('');
    log('[项目] iOS CocoaPods — 仅 macOS 需要，已跳过');
    return;
  }

  log('');
  log('[项目] iOS CocoaPods');
  if (!pathExists(path.join(IOS_DIR, 'Podfile'))) {
    warn('未找到 ios/Podfile');
    return;
  }

  if (!hasCommand('pod')) {
    info('安装 CocoaPods gem...');
    tryRun('gem install cocoapods', { inherit: true });
  }

  if (!hasCommand('pod')) {
    warn('请安装 CocoaPods: sudo gem install cocoapods');
    return;
  }

  const env = {
    ...process.env,
    LANG: 'en_US.UTF-8',
    LC_ALL: 'en_US.UTF-8',
  };
  if (isMac) {
    env.GIT_CONFIG_COUNT = '1';
    env.GIT_CONFIG_KEY_0 = 'http.version';
    env.GIT_CONFIG_VALUE_0 = 'HTTP/1.1';
  }

  info('pod install (ios/)...');
  const result = spawnSync('pod', ['install'], {
    cwd: IOS_DIR,
    stdio: 'inherit',
    env,
    shell: isWin,
  });
  if (result.status === 0) ok('CocoaPods 完成');
  else warn('pod install 失败，可稍后手动: cd ios && pod install');
}

// ─── 项目级 ─────────────────────────────────────────────

function ensureGradlew() {
  if (!pathExists(GRADLEW)) return;
  try {
    if ((fs.statSync(GRADLEW).mode & 0o111) === 0) {
      fs.chmodSync(GRADLEW, 0o755);
      ok('android/gradlew 已 chmod +x');
    }
  } catch {
    /* windows 无 chmod */
  }
}

function installJsDeps() {
  log('');
  log('[项目] JavaScript 依赖');
  if (!hasCommand('pnpm')) {
    info('安装 pnpm...');
    tryRun('npm install -g pnpm', { inherit: true });
  }
  if (!hasCommand('pnpm')) {
    warn('未找到 pnpm，请先: npm install -g pnpm');
    return;
  }
  info('pnpm install...');
  if (tryRun('pnpm install', { inherit: true })) ok('依赖安装完成');
  else warn('pnpm install 失败');
}

function runSetupEnv() {
  log('');
  log('[项目] 扫描工具路径并生成 .env');
  const result = spawnSync(process.execPath, [path.join(__dirname, 'setup-env.js')], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  return result.status ?? 1;
}

// ─── main ─────────────────────────────────────────────

function main() {
  const os = require('os');
  log('');
  log('========================================');
  log('  MyRnApp — 全平台开发环境安装');
  log('========================================');
  log(`平台: ${process.platform} ${os.arch()}`);
  if (skipSystem) log('模式: 仅项目依赖（--skip-system）');

  if (!skipSystem) {
    setupNode();
    setupJdk();
    setupWatchman();
    setupAndroidSdk();
    setupXcode();
  }

  setupCocoaPods();
  ensureGradlew();
  installJsDeps();

  const envExit = runSetupEnv();

  log('');
  log('========================================');
  if (envExit === 0) {
    log('安装完成。常用命令:');
    log('  pnpm dev:mobile     # Metro');
    log('  pnpm ios            # iOS (macOS)');
    log('  pnpm android        # Android（自动加载 .env）');
  } else {
    log('项目依赖已处理；部分系统工具未就绪，请按上方提示安装后:');
    log('  pnpm setup:env');
  }
  log('');
  log('加载环境变量:');
  if (isWin) {
    log('  使用 pnpm android / pnpm setup:env 自动读取 .env');
  } else {
    log('  eval "$(node scripts/print-env-export.js)"');
  }
  log('');

  process.exit(envExit);
}

main();
