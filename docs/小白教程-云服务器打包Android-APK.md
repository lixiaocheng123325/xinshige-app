# 小白教程：云服务器打包 Android APK（一步一步跟着做）

> 目标：在云服务器上安装打包环境，打出 APK 文件，下载回自己电脑
>
> 预计时间：30-40 分钟
> 预计花费：约 1-2 元（按量付费，用完后关机就不扣钱了）

---

## 第一步：租一台云服务器（5分钟）

### 1.1 打开阿里云官网

电脑浏览器访问：https://www.aliyun.com/

点击右上角 **"登录"**，用支付宝或淘宝账号登录。

### 1.2 找到云服务器 ECS

登录后，鼠标移到左上角 **"产品"**，找到 **"云服务器 ECS"**，点击进入。

### 1.3 点击"立即购买"

页面中间有个蓝色按钮 **"立即购买"**，点击它。

### 1.4 选择配置（按下图选）

| 选项 | 选什么 |
|------|--------|
| 付费模式 | **按量付费**（用多少付多少，打完包就关机） |
| 地域 | 选离你最近的，比如 **"华东1（杭州）"** |
| 实例规格 | 选 **"2核(vCPU) 4 GiB"**（最便宜够用） |
| 镜像 | 选 **"Ubuntu 22.04 64位"** |
| 系统盘 | **ESSD Entry 50GB**（默认就行） |
| 带宽 | **按使用流量**，1Mbps（默认就行） |
| 安全组 | 勾选 **"SSH (22)"** 和 **"HTTP (80)"** |
| 登录密码 | 自己设一个密码，**记下来**！ |

### 1.5 确认下单

选好之后点右下角 **"确认订单"** → **"创建实例"**。

等待 1-2 分钟，提示"创建成功"。

### 1.6 记住服务器 IP

创建成功后，页面会显示一个 **"公网 IP"**，比如 `47.123.45.67`，**复制下来**，后面要用。

---

## 第二步：登录云服务器（2分钟）

### 2.1 下载连接工具

电脑浏览器访问：https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html

下载 **"64-bit x86"** 版本的 PuTTY（如果你电脑是 64 位的，现在基本都是）。

下载后双击安装，全部点 **"Next"** 就行。

### 2.2 打开 PuTTY 连接服务器

1. 打开桌面上的 **"PuTTY"** 软件
2. 在 **"Host Name"** 输入框里粘贴你的服务器 IP（比如 `47.123.45.67`）
3. 端口保持 **22**
4. 点击下方 **"Open"** 按钮
5. 弹出一个黑色窗口，显示 `login as:`
6. 输入 `root`，按回车
7. 提示输入密码，输入你刚才设的密码（输入时不会显示字符，是正常的），按回车
8. 看到类似 `root@iZ2zexxxxxx:~#` 就说明登录成功了

> 💡 **第一次连接会弹安全警告，点 "是" 或 "Accept"**

---

## 第三步：一键安装打包环境（15-20分钟）

登录成功后，你会看到一个黑色命令行窗口。

**把下面这整块代码全部复制，然后在 PuTTY 窗口里右键粘贴，按回车执行。**

```bash
# ============================================
# 1. 更新系统
# ============================================
sudo apt update && sudo apt upgrade -y

# ============================================
# 2. 安装必要软件
# ============================================
sudo apt install -y curl git unzip xz-utils zip libglu1-mesa openjdk-17-jdk wget

# ============================================
# 3. 安装 Flutter
# ============================================
cd ~
export FLUTTER_VERSION="3.24.5"
wget https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_${FLUTTER_VERSION}-stable.tar.xz
tar xf flutter_linux_${FLUTTER_VERSION}-stable.tar.xz
export PATH="$PATH:$HOME/flutter/bin"
flutter config --no-analytics
flutter precache

# ============================================
# 4. 安装 Android SDK
# ============================================
export ANDROID_SDK_ROOT="$HOME/android-sdk"
mkdir -p $ANDROID_SDK_ROOT/cmdline-tools
cd $ANDROID_SDK_ROOT/cmdline-tools
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip -q commandlinetools-linux-11076708_latest.zip
mv cmdline-tools latest

export PATH="$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools"

# 安装必要的 SDK 组件（会提示确认 license，自动 yes）
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# ============================================
# 5. 保存环境变量（下次登录自动生效）
# ============================================
echo '
# Flutter + Android SDK
export PATH="$PATH:$HOME/flutter/bin"
export ANDROID_SDK_ROOT="$HOME/android-sdk"
export PATH="$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools"
' >> ~/.bashrc

# ============================================
# 6. 验证安装是否成功
# ============================================
source ~/.bashrc
flutter doctor
```

**执行后你会看到很多输出，最后出现 `flutter doctor` 的结果。**

如果看到类似下面这样（可能有几个黄色警告，没关系），就说明装好了：

```
[✓] Flutter (Channel stable, 3.24.5)
[✓] Android toolchain - develop for Android devices
[✗] Chrome - develop for the web (Cannot find Chrome executable)
[!] Network resources
```

> ⏱️ 这一步需要等 **15-20 分钟**，不要关闭窗口，让它自己跑完。

---

## 第四步：把项目代码传到服务器（3分钟）

### 4.1 在服务器上创建项目目录

在 PuTTY 窗口里输入：

```bash
cd ~
mkdir -p 心事盒
```

### 4.2 下载 FileZilla（传文件工具）

电脑浏览器访问：https://filezilla-project.org/download.php?type=client

下载 **FileZilla Client**，安装（全部点 Next）。

### 4.3 用 FileZilla 连接服务器

1. 打开 FileZilla
2. 顶部输入：
   - **主机**：你的服务器 IP（比如 `47.123.45.67`）
   - **用户名**：`root`
   - **密码**：你设的密码
   - **端口**：`22`
3. 点击 **"快速连接"**
4. 右边会显示服务器上的文件

### 4.4 上传项目代码

1. 左边是你电脑的文件（找到 `c:\Users\Lenovo\Desktop\最终备忘项目`）
2. 右边是服务器的文件，双击进入 `心事盒` 文件夹
3. 在左边选中整个项目文件夹里的所有文件和文件夹
4. 右键 → **"上传"**
5. 等待上传完成（约 1-2 分钟）

---

## 第五步：打包 APK（5-10分钟）

上传完成后，回到 PuTTY 窗口，输入以下命令：

```bash
cd ~/心事盒/mobile
flutter pub get
flutter build apk --release
```

然后等待，你会看到很多输出，最后显示：

```
✓ Built build/app/outputs/flutter-apk/app-release.apk (xx.xMB)
```

这就说明 APK 打好了！

---

## 第六步：下载 APK 回自己电脑（1分钟）

回到 FileZilla：

1. 右边服务器文件列表里，依次双击进入：`心事盒` → `mobile` → `build` → `app` → `outputs` → `flutter-apk`
2. 你会看到一个叫 `app-release.apk` 的文件
3. 把它从右边拖到左边（你电脑的桌面或某个文件夹）

**APK 就在你电脑里了，可以发给客户！**

---

## 第七步：关掉云服务器（省钱）

打包完成后，回到阿里云控制台，找到你的服务器，点击 **"停止"** 或 **"释放"**（释放后数据会清空，APK 已经下载了没关系）。

如果不关，按量付费会一直扣钱。

---

## 遇到问题怎么办

| 问题 | 解决方法 |
|------|---------|
| PuTTY 连不上 | 检查 IP 和端口 22，安全组是否允许 SSH |
| 脚本执行报错 | 把报错信息复制发给我 |
| `flutter doctor` 显示红色错误 | 发给我截图 |
| FileZilla 传不上文件 | 检查 IP/用户名/密码/端口 22 |
| 打包失败 | 把最后 20 行输出发给我 |

---

**下一步：打 iOS IPA → 看另一份《小白教程-Codemagic打包iOS-IPA》**
