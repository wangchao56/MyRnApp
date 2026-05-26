#!/usr/bin/env node
/**
 * 扫描本机开发工具路径，写入项目根目录 `.env`。
 * 缺失 JDK / Android SDK 等时输出分平台安装说明。
 *
 * 使用: pnpm setup:env
 */
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env');
const EXAMPLE_PATH = path.join(ROOT, '.env.example');
const GRADLEW = path.join(ROOT, 'android', 'gradlew');

const isWin = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

/** RN 0.77 Android 构建要求（与 android/build.gradle 一致） */
const RN_ANDROID = {
  compileSdk: 35,
  buildTools: '35.0.0',
  ndk: '27.1.12297006',
  minJdk: 17,
};

const issues = [];

function log(msg) {
  console.log(msg);
}

function ok(msg) {
  console.log(`  ✓ ${msg}`);
}

function warn(msg) {
  console.warn(`  ! ${msg}`);
}

function pathExists(p) {
  if (!p) return false;
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function uniquePaths(paths) {
  const seen = new Set();
  return paths.filter(p => {
    if (!p) return false;
    const norm = path.normalize(p);
    if (seen.has(norm)) return false;
    seen.add(norm);
    return true;
  });
}

function runQuiet(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function scanDirectoryForJdk(dir) {
  const found = [];
  if (!pathExists(dir)) return found;
  try {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (!fs.statSync(full).isDirectory()) continue;
      const home = pathExists(path.join(full, 'Contents', 'Home'))
        ? path.join(full, 'Contents', 'Home')
        : full;
      if (pathExists(path.join(home, 'bin', isWin ? 'java.exe' : 'java'))) {
        found.push(home);
      }
    }
  } catch {
    /* ignore */
  }
  return found;
}

/** 收集本机可能的 JAVA_HOME */
function collectJavaCandidates() {
  const list = [];

  if (process.env.JAVA_HOME) list.push(process.env.JAVA_HOME);

  if (isMac) {
    for (const v of ['17', '21', '11', '']) {
      const flag = v ? `-v ${v}` : '';
      const out = runQuiet(`/usr/libexec/java_home ${flag} 2>/dev/null`);
      if (out) list.push(out);
    }
    list.push(...scanDirectoryForJdk('/Library/Java/JavaVirtualMachines'));
  }

  if (isWin) {
    const roots = [
      process.env['ProgramFiles'],
      process.env['ProgramFiles(x86)'],
      path.join(process.env.LOCALAPPDATA || '', 'Programs'),
    ].filter(Boolean);
    for (const root of roots) {
      list.push(...scanDirectoryForJdk(path.join(root, 'Java')));
      list.push(...scanDirectoryForJdk(path.join(root, 'Eclipse Adoptium')));
      list.push(...scanDirectoryForJdk(path.join(root, 'Microsoft')));
    }
  }

  if (isLinux) {
    list.push(
      '/usr/lib/jvm/java-17-openjdk-amd64',
      '/usr/lib/jvm/java-17-openjdk',
      '/usr/lib/jvm/java-21-openjdk-amd64',
      '/usr/lib/jvm/default-java',
    );
    list.push(...scanDirectoryForJdk('/usr/lib/jvm'));
  }

  list.push(
    '/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home',
    '/opt/homebrew/opt/openjdk@17',
    '/usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home',
    '/usr/local/opt/openjdk@17',
    '/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home',
    '/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home',
    'C:\\Program Files\\Java\\jdk-17',
    'C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.13.11-hotspot',
    'C:\\Program Files\\Microsoft\\jdk-17.0.13.11-hotspot',
  );

  const whichJava = isWin ? runQuiet('where java') : runQuiet('which java');
  if (whichJava) {
    const first = whichJava.split(/\r?\n/)[0].trim();
    const resolved = resolveJavaHomeFromBinary(first);
    if (resolved) list.push(resolved);
  }

  return uniquePaths(list.filter(isValidJdkHome));
}

/** 排除 macOS /usr/bin/java 等占位符 */
function isValidJdkHome(home) {
  if (!pathExists(home)) return false;
  const blocked = new Set(['/usr', '/bin', '/usr/bin', '/opt/homebrew/bin']);
  if (blocked.has(path.normalize(home))) return false;
  const javaBin = path.join(home, 'bin', isWin ? 'java.exe' : 'java');
  if (!pathExists(javaBin)) return false;
  const ver = getJavaVersion(home);
  return Boolean(ver && parseJavaMajor(ver) > 0);
}

function resolveJavaHomeFromBinary(javaPath) {
  if (!javaPath || !pathExists(javaPath)) return null;
  if (isMac && (javaPath === '/usr/bin/java' || javaPath.startsWith('/usr/bin/'))) {
    return null;
  }
  const binDir = path.dirname(javaPath);
  const maybeHome = path.dirname(binDir);
  return isValidJdkHome(maybeHome) ? maybeHome : null;
}

function parseJavaMajor(ver) {
  if (!ver) return 0;
  const parts = String(ver).split('.');
  if (parts[0] === '1' && parts[1]) return parseInt(parts[1], 10);
  return parseInt(parts[0], 10) || 0;
}

function getJavaVersion(javaHome) {
  const javaBin = path.join(javaHome, 'bin', isWin ? 'java.exe' : 'java');
  if (!pathExists(javaBin)) return null;
  const out = runQuiet(`"${javaBin}" -version 2>&1`);
  if (!out) return null;
  const m = out.match(/version "(.+?)"/);
  return m ? m[1] : out.split('\n')[0];
}

function pickJavaHome(candidates) {
  const valid = candidates.filter(isValidJdkHome);
  let best = null;
  let bestMajor = 0;
  for (const home of valid) {
    const ver = getJavaVersion(home);
    const major = parseJavaMajor(ver);
    if (major >= RN_ANDROID.minJdk && major >= bestMajor) {
      best = home;
      bestMajor = major;
    }
  }
  if (best) return { home: best, version: getJavaVersion(best) };

  const fallback = valid[0];
  if (fallback) {
    const ver = getJavaVersion(fallback);
    const major = parseJavaMajor(ver);
    if (major > 0 && major < RN_ANDROID.minJdk) {
      return { home: fallback, version: ver, warning: 'version_low' };
    }
  }
  return null;
}

/** 收集 ANDROID_HOME 候选 */
function collectAndroidCandidates() {
  const list = [];
  if (process.env.ANDROID_HOME) list.push(process.env.ANDROID_HOME);
  if (process.env.ANDROID_SDK_ROOT) list.push(process.env.ANDROID_SDK_ROOT);

  if (isWin) {
    list.push(
      path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk'),
      path.join(process.env.USERPROFILE || '', 'AppData', 'Local', 'Android', 'Sdk'),
    );
  } else {
    list.push(
      path.join(os.homedir(), 'Library', 'Android', 'sdk'),
      path.join(os.homedir(), 'Android', 'Sdk'),
      '/usr/local/share/android-sdk',
      '/opt/android-sdk',
    );
  }

  return uniquePaths(list.filter(pathExists));
}

function inspectAndroidSdk(sdkRoot) {
  const adb = path.join(sdkRoot, 'platform-tools', isWin ? 'adb.exe' : 'adb');
  const emulator = path.join(sdkRoot, 'emulator', isWin ? 'emulator.exe' : 'emulator');
  const sdkmanager = path.join(
    sdkRoot,
    'cmdline-tools',
    'latest',
    'bin',
    isWin ? 'sdkmanager.bat' : 'sdkmanager',
  );
  const buildToolsDir = path.join(sdkRoot, 'build-tools', RN_ANDROID.buildTools);
  const platformDir = path.join(sdkRoot, 'platforms', `android-${RN_ANDROID.compileSdk}`);
  const ndkDir = path.join(sdkRoot, 'ndk', RN_ANDROID.ndk);

  return {
    root: sdkRoot,
    hasAdb: pathExists(adb),
    hasEmulator: pathExists(emulator),
    hasSdkManager: pathExists(sdkmanager),
    hasBuildTools: pathExists(buildToolsDir),
    hasPlatform: pathExists(platformDir),
    hasNdk: pathExists(ndkDir),
    missingPackages: [
      !pathExists(platformDir) && `platforms;android-${RN_ANDROID.compileSdk}`,
      !pathExists(buildToolsDir) && `build-tools;${RN_ANDROID.buildTools}`,
      !pathExists(path.join(sdkRoot, 'platform-tools')) && 'platform-tools',
      !pathExists(ndkDir) && `ndk;${RN_ANDROID.ndk}`,
    ].filter(Boolean),
  };
}

function listAndroidAvds(androidHome) {
  if (!androidHome) return [];
  const emulator = path.join(androidHome, 'emulator', isWin ? 'emulator.exe' : 'emulator');
  if (!pathExists(emulator)) return [];
  const out = runQuiet(`"${emulator}" -list-avds`);
  return out ? out.split(/\r?\n/).filter(Boolean) : [];
}

function detectNode() {
  const ver = runQuiet('node -v');
  if (!ver) return null;
  const major = parseInt(ver.replace(/^v/, '').split('.')[0], 10);
  return { version: ver, ok: major >= 18 };
}

function detectWatchman() {
  const ver = runQuiet('watchman -v');
  return ver ? { version: ver.split('\n')[0] } : null;
}

function getLocalIPv4() {
  for (const ifaces of Object.values(os.networkInterfaces())) {
    if (!ifaces) continue;
    for (const net of ifaces) {
      if (net.family === 'IPv4' || net.family === 4) {
        if (!net.internal) return net.address;
      }
    }
  }
  return '127.0.0.1';
}

function printBlock(title, lines) {
  log('');
  log(`━━ ${title} ━━`);
  for (const line of lines) {
    log(`  ${line}`);
  }
}

function printJavaInstallGuide() {
  if (isMac) {
    printBlock('安装 JDK 17（macOS）', [
      '方式一（推荐，Homebrew）:',
      '  brew install --cask zulu@17',
      '  pnpm setup:env',
      '',
      '方式二（Temurin）:',
      '  brew install --cask temurin@17',
      '',
      '验证: java -version  应显示 17.x',
      '文档: https://reactnative.dev/docs/set-up-your-environment',
    ]);
  } else if (isWin) {
    printBlock('安装 JDK 17（Windows）', [
      '1. 下载并安装 Eclipse Temurin 17 或 Microsoft Build of OpenJDK 17',
      '   https://adoptium.net/temurin/releases/?version=17',
      '2. 设置系统环境变量 JAVA_HOME 为安装目录（含 bin 的上一级）',
      '3. 将 %JAVA_HOME%\\bin 加入 Path',
      '4. 重新打开终端，执行: pnpm setup:env',
    ]);
  } else {
    printBlock('安装 JDK 17（Linux）', [
      'Debian/Ubuntu:',
      '  sudo apt update',
      '  sudo apt install openjdk-17-jdk',
      '',
      'Fedora:',
      '  sudo dnf install java-17-openjdk-devel',
      '',
      '然后: pnpm setup:env',
    ]);
  }
}

function printAndroidInstallGuide() {
  if (isMac) {
    printBlock('安装 Android SDK（macOS）', [
      '方式一（推荐）— Android Studio:',
      '  1. 下载: https://developer.android.com/studio',
      '  2. 安装后打开 SDK Manager，勾选:',
      `     - Android SDK Platform ${RN_ANDROID.compileSdk}`,
      `     - Android SDK Build-Tools ${RN_ANDROID.buildTools}`,
      `     - NDK ${RN_ANDROID.ndk}`,
      '     - Android SDK Platform-Tools',
      '  3. SDK 默认路径: ~/Library/Android/sdk',
      '  4. 在 Device Manager 中创建虚拟设备 (AVD)',
      '  5. pnpm setup:env',
      '',
      '方式二 — 仅命令行工具:',
      '  brew install --cask android-commandlinetools',
      '  按 brew 提示配置 sdkmanager 并安装上述组件',
    ]);
  } else if (isWin) {
    printBlock('安装 Android SDK（Windows）', [
      '1. 安装 Android Studio: https://developer.android.com/studio',
      '2. SDK 默认路径: %LOCALAPPDATA%\\Android\\Sdk',
      '3. SDK Manager 中安装 Platform 35、Build-Tools 35.0.0、NDK、Platform-Tools',
      '4. 创建 AVD 后执行: pnpm setup:env',
    ]);
  } else {
    printBlock('安装 Android SDK（Linux）', [
      '1. 安装 Android Studio 或 android-sdk 命令行包',
      '2. 设置 ANDROID_HOME，例如: export ANDROID_HOME=$HOME/Android/Sdk',
      '3. 用 sdkmanager 安装 platform-35、build-tools;35.0.0、ndk 等',
      '4. pnpm setup:env',
    ]);
  }
}

function printSdkPackagesGuide(sdkRoot, missingPackages) {
  const sdkmanager = path.join(
    sdkRoot,
    'cmdline-tools',
    'latest',
    'bin',
    isWin ? 'sdkmanager.bat' : 'sdkmanager',
  );
  printBlock('补全 Android SDK 组件', [
    `SDK 根目录: ${sdkRoot}`,
    '缺少: ' + missingPackages.join(', '),
    '',
    ...(pathExists(sdkmanager)
      ? [
          '在终端执行（接受协议）:',
          `  yes | "${sdkmanager}" ${missingPackages.join(' ')}`,
          '然后: pnpm setup:env',
        ]
      : [
          '请用 Android Studio → SDK Manager 勾选上述组件，',
          '或安装 cmdline-tools 后使用 sdkmanager。',
        ]),
  ]);
}

function printAvdGuide(androidHome) {
  const emulator = androidHome
    ? path.join(androidHome, 'emulator', isWin ? 'emulator.exe' : 'emulator')
    : null;
  printBlock('创建 / 启动 Android 模拟器', [
    'Android Studio → Device Manager → Create Device',
    '或使用命令行:',
    ...(emulator && pathExists(emulator)
      ? ['  emulator -list-avds', '  emulator @<AVD名称>']
      : ['  需先安装 emulator 组件']),
    '启动后再执行: pnpm android',
  ]);
}

function parseExistingEnv(filePath) {
  const values = {};
  if (!pathExists(filePath)) return values;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    values[key] = val;
  }
  return values;
}

function quoteEnvValue(val) {
  if (/[\s#"']/.test(val)) {
    return `"${val.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return val;
}

function buildEnvContent({ androidHome, javaHome, localIp, avds, preserved }) {
  const packagerHost = preserved.REACT_NATIVE_PACKAGER_HOSTNAME || localIp;
  const webPort = preserved.WEB_DEV_PORT || '3000';
  const bridgePath = preserved.BRIDGE_TEST_PATH || '/bridge-test';
  const bridgeUrl =
    preserved.BRIDGE_TEST_WEB_URL ||
    `http://${packagerHost}:${webPort}${bridgePath}`;
  const webUrl = preserved.WEB_DEV_URL || `http://localhost:${webPort}`;
  const avd =
    preserved.ANDROID_AVD ||
    (avds.includes('Medium_Phone_API_36.0') ? 'Medium_Phone_API_36.0' : avds[0] || '');

  const lines = [
    '# Generated by: pnpm setup:env',
    `# Platform: ${process.platform} ${process.arch}`,
    `# Date: ${new Date().toISOString()}`,
    '# Re-run: pnpm setup:env',
    '# Android 构建会由 pnpm android 通过 scripts/with-env.js 加载本文件',
    '',
    '# --- Android SDK (pnpm android 必需) ---',
  ];

  if (androidHome) {
    lines.push(`ANDROID_HOME=${quoteEnvValue(androidHome)}`);
    lines.push(`ANDROID_SDK_ROOT=${quoteEnvValue(androidHome)}`);
  } else {
    lines.push('# ANDROID_HOME=');
    lines.push('# ANDROID_SDK_ROOT=');
  }

  lines.push('');
  lines.push('# --- Java JDK 17+ (Gradle 必需) ---');
  if (javaHome) {
    lines.push(`JAVA_HOME=${quoteEnvValue(javaHome)}`);
  } else {
    lines.push('# JAVA_HOME=');
  }

  lines.push('');
  lines.push('# --- Metro 真机调试 ---');
  lines.push(`REACT_NATIVE_PACKAGER_HOSTNAME=${packagerHost}`);
  lines.push('');
  lines.push('# --- Web / Bridge 测试页 ---');
  lines.push(`WEB_DEV_PORT=${webPort}`);
  lines.push(`WEB_DEV_URL=${webUrl}`);
  lines.push(`BRIDGE_TEST_WEB_URL=${bridgeUrl}`);
  lines.push('');
  lines.push('# --- Android 模拟器（可选）---');
  if (avd) lines.push(`ANDROID_AVD=${avd}`);
  else lines.push('# ANDROID_AVD=');
  if (avds.length) lines.push(`# Available AVDs: ${avds.join(', ')}`);

  return `${lines.join('\n')}\n`;
}

function ensureGradlewExecutable() {
  if (!pathExists(GRADLEW)) {
    warn('未找到 android/gradlew');
    return;
  }
  try {
    if ((fs.statSync(GRADLEW).mode & 0o111) === 0) {
      fs.chmodSync(GRADLEW, 0o755);
      ok('已为 android/gradlew 添加可执行权限');
    } else {
      ok('android/gradlew 可执行权限正常');
    }
  } catch (e) {
    warn(`gradlew 权限: ${e.message}`);
  }
}

function main() {
  log('');
  log('MyRnApp — 开发环境扫描与 .env 生成');
  log('========================================');
  log(`系统: ${os.type()} ${os.release()} (${process.arch})`);

  const preserved = parseExistingEnv(ENV_PATH);

  // --- Node ---
  log('');
  log('[1/5] Node.js');
  const node = detectNode();
  if (node?.ok) {
    ok(`已安装 ${node.version} (需要 >= 18)`);
  } else if (node) {
    warn(`已安装 ${node.version}，版本过低，请升级到 Node 18+`);
    issues.push('node');
    printBlock('升级 Node.js', [
      'macOS: brew install node@22  或使用 nvm: nvm install 22',
      '官网: https://nodejs.org/',
    ]);
  } else {
    warn('未检测到 Node.js');
    issues.push('node');
    printBlock('安装 Node.js', [
      'macOS: brew install node@22',
      '或安装 nvm: https://github.com/nvm-sh/nvm',
      '本项目 package.json 要求: node >= 18',
    ]);
  }

  // --- Java ---
  log('');
  log('[2/5] JDK (JAVA_HOME)');
  const javaCandidates = collectJavaCandidates();
  if (javaCandidates.length) {
    log(`  扫描到 ${javaCandidates.length} 个候选路径:`);
    javaCandidates.slice(0, 8).forEach(p => log(`    - ${p}`));
    if (javaCandidates.length > 8) log(`    ... 另有 ${javaCandidates.length - 8} 个`);
  } else {
    log('  未在常见路径发现 JDK');
  }

  const javaPick = pickJavaHome(javaCandidates);
  let javaHome = null;
  if (javaPick?.home && !javaPick.warning) {
    javaHome = javaPick.home;
    ok(`选用 JAVA_HOME=${javaHome}`);
    ok(`版本: ${javaPick.version}`);
  } else if (javaPick?.warning === 'version_low') {
    warn(`发现 JDK 但版本低于 ${RN_ANDROID.minJdk}: ${javaPick.version} @ ${javaPick.home}`);
    issues.push('jdk');
    printJavaInstallGuide();
  } else {
    warn('未找到可用的 JDK 17+');
    issues.push('jdk');
    printJavaInstallGuide();
  }

  // --- Android SDK ---
  log('');
  log('[3/5] Android SDK (ANDROID_HOME)');
  const androidCandidates = collectAndroidCandidates();
  if (androidCandidates.length) {
    log(`  扫描到 ${androidCandidates.length} 个候选路径:`);
    androidCandidates.forEach(p => log(`    - ${p}`));
  } else {
    log('  未在常见路径发现 Android SDK');
  }

  const sdkRoot = androidCandidates[0] || null;
  let androidHome = null;
  if (sdkRoot) {
    const sdk = inspectAndroidSdk(sdkRoot);
    androidHome = sdk.root;
    ok(`ANDROID_HOME=${androidHome}`);
    ok(`adb: ${sdk.hasAdb ? '有' : '无'}`);
    ok(`emulator: ${sdk.hasEmulator ? '有' : '无'}`);
    ok(`platform android-${RN_ANDROID.compileSdk}: ${sdk.hasPlatform ? '有' : '无'}`);
    ok(`build-tools ${RN_ANDROID.buildTools}: ${sdk.hasBuildTools ? '有' : '无'}`);
    ok(`ndk ${RN_ANDROID.ndk}: ${sdk.hasNdk ? '有' : '无'}`);

    if (sdk.missingPackages.length) {
      warn(`SDK 缺少组件: ${sdk.missingPackages.join(', ')}`);
      issues.push('sdk_packages');
      printSdkPackagesGuide(sdk.root, sdk.missingPackages);
    }
  } else {
    warn('未找到 Android SDK');
    issues.push('android_sdk');
    printAndroidInstallGuide();
  }

  // --- AVD ---
  log('');
  log('[4/5] Android 模拟器 (AVD)');
  const avds = listAndroidAvds(androidHome);
  if (avds.length) {
    ok(`已发现 ${avds.length} 个 AVD: ${avds.join(', ')}`);
  } else {
    warn('未发现可用 AVD（不影响真机调试）');
    issues.push('avd');
    printAvdGuide(androidHome);
  }

  // --- 其它 ---
  log('');
  log('[5/5] 其它工具');
  const watchman = detectWatchman();
  if (watchman) ok(`watchman ${watchman.version}`);
  else {
    warn('未安装 watchman（可选，建议 macOS 安装以提升 Metro 性能）');
    if (isMac) log('  安装: brew install watchman');
  }

  const localIp = getLocalIPv4();
  ok(`本机 LAN IP: ${localIp} (已写入 REACT_NATIVE_PACKAGER_HOSTNAME)`);

  ensureGradlewExecutable();

  fs.writeFileSync(
    ENV_PATH,
    buildEnvContent({ androidHome, javaHome, localIp, avds, preserved }),
    'utf8',
  );
  log('');
  ok(`已写入 ${path.relative(ROOT, ENV_PATH)}`);

  log('');
  log('========================================');
  if (issues.length === 0) {
    log('环境检查通过。可执行:');
    log('  pnpm dev:mobile    # Metro');
    log('  pnpm android       # 构建并安装 Android（自动加载 .env）');
    if (avds[0]) log(`  emulator @${avds[0]}   # 若需先手动开模拟器`);
  } else {
    log('部分工具未就绪，请按上方说明安装后重新运行:');
    log('  pnpm setup:env');
    log('');
    log('当前 shell 手动加载 .env（macOS/Linux）:');
    log('  eval "$(node scripts/print-env-export.js)"');
  }
  log('');

  const fatal = issues.some(i => ['jdk', 'android_sdk', 'node'].includes(i));
  process.exit(fatal ? 1 : 0);
}

main();
