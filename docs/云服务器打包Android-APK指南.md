# 云服务器打包 Android APK 指南

## 一、租用云服务器推荐

| 厂商 | 配置建议 | 价格 |
|------|---------|------|
| 阿里云 ECS | 2核4G + 50GB SSD | ¥0.3-0.5/小时 |
| 腾讯云 CVM | 2核4G + 50GB SSD | ¥0.3-0.5/小时 |
| 华为云 ECS | 2核4G + 50GB SSD | ¥0.3-0.5/小时 |

> 系统选择 **Ubuntu 22.04 LTS**（推荐）或 Windows Server 2022

## 二、一键安装脚本（Ubuntu）

登录云服务器后，复制粘贴以下命令：

```bash
# ============================================
# 1. 安装基础依赖
# ============================================
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip xz-utils zip libglu1-mesa openjdk-17-jdk wget

# ============================================
# 2. 安装 Flutter
# ============================================
cd ~
export FLUTTER_VERSION="3.24.5"
wget https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_${FLUTTER_VERSION}-stable.tar.xz
tar xf flutter_linux_${FLUTTER_VERSION}-stable.tar.xz
export PATH="$PATH:$HOME/flutter/bin"
flutter config --no-analytics
flutter precache

# ============================================
# 3. 安装 Android SDK
# ============================================
export ANDROID_SDK_ROOT="$HOME/android-sdk"
mkdir -p $ANDROID_SDK_ROOT/cmdline-tools
cd $ANDROID_SDK_ROOT/cmdline-tools
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip -q commandlinetools-linux-11076708_latest.zip
mv cmdline-tools latest

export PATH="$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools"

# 安装必要的 SDK 组件
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# ============================================
# 4. 配置环境变量
# ============================================
echo '
# Flutter + Android SDK
export PATH="$PATH:$HOME/flutter/bin"
export ANDROID_SDK_ROOT="$HOME/android-sdk"
export PATH="$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools"
' >> ~/.bashrc

# ============================================
# 5. 验证安装
# ============================================
source ~/.bashrc
flutter doctor
```

## 三、打包 APK

```bash
# 1. 把项目代码传到云服务器
# 方式A：git clone（如果代码在仓库）
git clone https://github.com/你的仓库/心事盒.git
cd 心事盒/mobile

# 方式B：用 scp 或 ftp 上传整个项目目录

# 2. 安装依赖
flutter pub get

# 3. 打包 APK
flutter build apk --release

# 4. 生成的 APK 位置：
# build/app/outputs/flutter-apk/app-release.apk
```

## 四、下载 APK

```bash
# 从云服务器下载到本地电脑
scp root@你的服务器IP:/root/心事盒/mobile/build/app/outputs/flutter-apk/app-release.apk ./
```

或用 FTP/SFTP 工具（如 FileZilla）下载。

## 五、常见问题

**Q：为什么不用 Windows 云服务器？**
A：可以，但 Ubuntu 更省资源，SDK 安装也更简单。Windows 需要手动下载安装包，步骤更多。

**Q：打包一次需要多久？**
A：首次打包约 10-15 分钟（下载依赖），后续约 3-5 分钟。

**Q：可以打 AAB（Google Play 要求的格式）吗？**
A：可以，命令换成 `flutter build appbundle --release`
