@echo off
echo ====================================
echo Android 媒体保存功能测试脚本
echo ====================================
echo.

echo [1/3] 正在检查 Android 设备连接...
adb devices
if %errorlevel% neq 0 (
    echo ❌ 错误: 无法访问 ADB
    echo 请确保 Android SDK 配置正确
    pause
    exit /b 1
)
echo.

echo [2/3] 正在启动 Metro Bundler...
start "Metro Bundler" cmd /c "cd %~dp0.. && pnpm dev:app"
echo 已在新窗口启动 Metro Bundler
echo 等待 Metro Bundler 启动...
timeout /t 10 /nobreak > nul
echo.

echo [3/3] 正在启动应用...
cd %~dp0..
call pnpm android

pause
