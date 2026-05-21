#!/bin/bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
fail()  { echo -e "${RED}[FAIL]${NC} $1"; }

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$PROJECT_DIR/.env.local"

check_command() {
    command -v "$1" &>/dev/null
}

check_and_install_brew() {
    if check_command brew; then
        ok "Homebrew: $(brew --version | head -1)"
    else
        info "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

        if [[ $(uname -m) == 'arm64' ]]; then
            eval "$(/opt/homebrew/bin/brew shellenv)"
        else
            eval "$(/usr/local/bin/brew shellenv)"
        fi
        ok "Homebrew installed"
    fi
}

install_node() {
    local required_version="18"
    if check_command node; then
        local node_major=$(node -e "console.log(process.versions.node.split('.')[0])")
        if [ "$node_major" -ge "$required_version" ]; then
            ok "Node.js: $(node --version)"
            return
        fi
    fi
    info "Installing Node.js via Homebrew..."
    brew install node@22
    brew link node@22 --overwrite --force 2>/dev/null || true
    ok "Node.js installed: $(node --version)"
}

install_watchman() {
    if check_command watchman; then
        ok "watchman: $(watchman version 2>/dev/null | head -1 || echo 'installed')"
        return
    fi
    info "Installing watchman..."
    brew install watchman
    ok "watchman installed"
}

install_jdk() {
    if check_command java; then
        ok "JDK: $(java -version 2>&1 | head -1)"
        return
    fi
    info "Installing JDK 17 (Zulu) via Homebrew..."
    brew install --cask zulu@17

    local zulu_home
    if [[ $(uname -m) == 'arm64' ]]; then
        zulu_home="$(/usr/libexec/java_home -v 17 2>/dev/null || echo '/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home')"
    else
        zulu_home="$(/usr/libexec/java_home -v 17 2>/dev/null || echo '/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home')"
    fi

    if [ -d "$zulu_home" ]; then
        export JAVA_HOME="$zulu_home"
        echo "export JAVA_HOME=\"$zulu_home\"" >> "$ENV_FILE"
        ok "JDK 17 installed: JAVA_HOME=$JAVA_HOME"
    else
        warn "JDK installed but JAVA_HOME not auto-detected. Please set it manually."
    fi
}

setup_android_env() {
    local android_sdk="$HOME/Library/Android/sdk"

    if [ -d "$android_sdk" ]; then
        ok "Android SDK found at $android_sdk"
    else
        warn "Android SDK not found at $android_sdk"
        info "Installing Android SDK command-line tools..."
        brew install --cask android-commandlinetools

        mkdir -p "$android_sdk"
        local cmdline_tools="$android_sdk/cmdline-tools"
        if [ ! -d "$cmdline_tools/latest" ]; then
            local brew_clt
            brew_clt="$(brew --prefix)/share/android-commandlinetools"
            if [ -d "$brew_clt" ]; then
                mkdir -p "$cmdline_tools"
                cp -r "$brew_clt" "$cmdline_tools/latest"
            fi
        fi
        ok "Android SDK command-line tools installed"
    fi

    if [ -f "$android_sdk/cmdline-tools/latest/bin/sdkmanager" ]; then
        info "Installing required Android SDK packages (API 34)..."
        yes | "$android_sdk/cmdline-tools/latest/bin/sdkmanager" \
            "platforms;android-34" \
            "build-tools;34.0.0" \
            "platform-tools" \
            "ndk;26.1.10909125" 2>/dev/null || true
        ok "Android SDK packages installed"
    fi

    if ! grep -q "ANDROID_HOME" "$ENV_FILE" 2>/dev/null; then
        echo "export ANDROID_HOME=\"\$HOME/Library/Android/sdk\"" >> "$ENV_FILE"
        echo "export PATH=\"\$PATH:\$ANDROID_HOME/emulator:\$ANDROID_HOME/platform-tools\"" >> "$ENV_FILE"
    fi
    export ANDROID_HOME="$android_sdk"
    export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"
    ok "ANDROID_HOME configured"
}

setup_ruby_gems() {
    if check_command bundle; then
        ok "Bundler: $(bundle --version)"
    else
        info "Installing Bundler..."
        gem install bundler
        ok "Bundler installed"
    fi

    info "Installing Ruby gems (via Bundler)..."
    cd "$PROJECT_DIR"
    bundle install
    ok "Ruby gems installed"
}

install_pods() {
    cd "$PROJECT_DIR/ios"
    if [ -f "Podfile.lock" ] && [ -d "Pods" ]; then
        info "Running pod install..."
    else
        info "Running pod install (first time, may take a while)..."
    fi
    bundle exec pod install
    ok "CocoaPods installed"
    cd "$PROJECT_DIR"
}

install_js_deps() {
    cd "$PROJECT_DIR"
    if [ -f "package-lock.json" ]; then
        info "Installing npm dependencies..."
        npm install
    elif [ -f "pnpm-lock.yaml" ]; then
        info "Installing pnpm dependencies..."
        pnpm install
    elif [ -f "yarn.lock" ]; then
        info "Installing yarn dependencies..."
        yarn install
    else
        info "Installing npm dependencies..."
        npm install
    fi
    ok "JS dependencies installed"
}

echo ""
echo "========================================="
echo "  MyRnApp - Development Environment Setup"
echo "========================================="
echo ""

touch "$ENV_FILE"

echo ">>> Step 1/9: Checking Homebrew"
check_and_install_brew

echo ""
echo ">>> Step 2/9: Checking Node.js"
install_node

echo ""
echo ">>> Step 3/9: Checking watchman"
install_watchman

echo ""
echo ">>> Step 4/9: Checking JDK"
install_jdk

echo ""
echo ">>> Step 5/9: Checking Android SDK & Environment"
setup_android_env

echo ""
echo ">>> Step 6/9: Checking Xcode"
if xcodebuild -version &>/dev/null; then
    ok "Xcode: $(xcodebuild -version | head -1)"
else
    fail "Xcode not found. Please install from the Mac App Store."
    echo "  https://apps.apple.com/app/xcode/id497799835"
fi

echo ""
echo ">>> Step 7/9: Setting up Ruby gems (Bundler)"
setup_ruby_gems

echo ""
echo ">>> Step 8/9: Installing CocoaPods (via Bundler)"
install_pods

echo ""
echo ">>> Step 9/9: Installing JS dependencies"
install_js_deps

echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "Environment variables written to: .env.local"
echo ""
echo "To activate environment variables in your current shell:"
echo "  source .env.local"
echo ""
echo "To start developing:"
echo "  npm run ios          # Run on iOS simulator"
echo "  npm run android      # Run on Android emulator"
echo "  npm start            # Start Metro bundler"
echo ""
