# 心事盒APP — Windows 本地环境搭建与测试完整指南

> 适用系统：Windows 10/11（64位）  
> 预计耗时：1.5 ~ 2 小时（视网络速度）  
> 目标：在 Windows 电脑上完整跑通后端 + 管理后台 + 安卓端，并测试登录和支付流程

---

## 一、环境准备清单

| 软件 | 用途 | 最低版本 | 下载地址 |
|------|------|----------|----------|
| Node.js | 运行后端和管理后台 | v18.x LTS | https://nodejs.org/zh-cn/download |
| MySQL | 数据存储 | 8.0+ | https://dev.mysql.com/downloads/installer |
| Flutter SDK | 编译移动端 | 3.x Stable | https://docs.flutter.dev/get-started/install/windows |
| Android Studio | 安卓模拟器/打包 | 最新版 | https://developer.android.com/studio |
| Git | 版本管理 | 2.40+ | https://git-scm.com/download/win |
| VS Code | 代码编辑（推荐） | 最新版 | https://code.visualstudio.com |

---

## 二、Node.js 安装

### 步骤 1：下载安装包
1. 访问 https://nodejs.org/zh-cn/download
2. 下载 **Windows Installer (.msi)**，选择 **LTS（长期支持版）**
3. 双击运行安装程序，全程点击【Next】即可（会自动配置环境变量）

### 步骤 2：验证安装
打开 **CMD 或 PowerShell**，输入：
```bash
node -v
npm -v
```
看到版本号即成功，例如：
```
v22.17.0
10.9.2
```

### 步骤 3：配置 npm 国内镜像（加速下载）
```bash
npm config set registry https://registry.npmmirror.com
```

---

## 三、MySQL 安装与配置

### 步骤 1：下载安装器
1. 访问 https://dev.mysql.com/downloads/installer
2. 下载 **Windows (x86, 32-bit), MSI Installer**（第二个大的，约 300MB+）
3. 选择 **No thanks, just start my download**

### 步骤 2：运行安装
1. 双击安装程序，选择 **Server only** 或 **Full**
2. 一路 Next，到 **Authentication Method** 页面时：
   - 选择 **Use Strong Password Encryption**
3. 设置 **root 密码**（牢记，后面要用）
4. 到 **Windows Service** 页面：
   - 勾选 **Configure MySQL Server as a Windows Service**
   - Service Name 保持默认 `MySQL80`
5. 点击 **Execute** 执行安装

### 步骤 3：验证 MySQL
打开 CMD：
```bash
mysql -u root -p
```
输入刚才设置的 root 密码，进入 `mysql>` 命令行即成功。

### 步骤 4：创建数据库
```sql
CREATE DATABASE xinshige CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

## 四、Flutter + Dart + Android Studio 安装

### 步骤 1：下载 Flutter SDK
1. 访问 https://docs.flutter.dev/get-started/install/windows
2. 下载 **flutter_windows_xxx-stable.zip**
3. 解压到 `C:\flutter`（路径不要有中文和空格）

### 步骤 2：配置环境变量
1. 右键【此电脑】→【属性】→【高级系统设置】→【环境变量】
2. 在 **系统变量** 中找到 `Path`，双击编辑
3. 点击【新建】，添加：
   ```
   C:\flutter\bin
   ```
4. 点击【确定】保存

### 步骤 3：验证 Flutter
打开一个新的 CMD/PowerShell：
```bash
flutter doctor
```
首次运行会自动下载 Dart SDK，稍等片刻。看到类似输出：
```
[✓] Flutter (Channel stable, 3.x.x, ...)
[✗] Android toolchain - develop for Android devices
```
（部分打叉是正常的，继续安装 Android Studio 即可修复）

### 步骤 4：安装 Android Studio
1. 访问 https://developer.android.com/studio
2. 下载并安装 Android Studio
3. 首次启动时，在 **SDK Manager** 中确保安装了：
   - **Android SDK Platform**（推荐 API 34）
   - **Android SDK Command-line Tools**
   - **Android SDK Build-Tools**
   - **Android Emulator**（如需模拟器）
   - **Android SDK Platform-Tools**

### 步骤 5：同意 Android 许可证
```bash
flutter doctor --android-licenses
```
一路输入 `y` 同意。

### 步骤 6：配置 ANDROID_HOME 环境变量
1. 打开环境变量设置
2. 新建 **系统变量**：
   - 变量名：`ANDROID_HOME`
   - 变量值：`C:\Users\你的用户名\AppData\Local\Android\Sdk`
3. 编辑 `Path`，添加：
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\cmdline-tools\latest\bin
   ```

### 步骤 7：再次验证
```bash
flutter doctor
```
确保 Android 相关项都显示 `[✓]`。

---

## 五、Java JDK 安装（安卓打包必需）

### 步骤 1：下载 JDK
1. 访问 https://www.oracle.com/java/technologies/downloads/#jdk17-windows
2. 下载 **JDK 17 Windows x64 Installer**
3. 安装（记住安装路径，如 `C:\Program Files\Java\jdk-17`）

### 步骤 2：配置环境变量
1. 新建系统变量 `JAVA_HOME`，值为 JDK 安装路径
2. 在 `Path` 中添加：
   ```
   %JAVA_HOME%\bin
   ```

### 步骤 3：验证
```bash
java -version
```

---

## 六、启动三个工程

### 6.1 启动后端（NestJS）

打开 PowerShell/CMD：
```bash
# 进入后端目录
cd C:\你的路径\最终备忘项目\backend

# 安装依赖（首次需要 2~5 分钟）
npm install

# 复制配置文件
copy .env.example .env

# 用记事本编辑 .env 文件，修改数据库密码为你设置的 root 密码
notepad .env
```

`.env` 中关键配置项：
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=你设置的MySQL密码
DB_DATABASE=xinshige
JWT_SECRET=任意随机字符串，如 xinshige_secret_2024
SMS_MOCK=true
PAY_MOCK=true
```

> `SMS_MOCK=true` 表示开发阶段不调用真实短信接口，验证码会打印在控制台。  
> `PAY_MOCK=true` 表示支付直接模拟成功，无需配置微信/支付宝真实密钥。

启动后端：
```bash
npm run start:dev
```
看到以下输出即成功：
```
Server running on http://localhost:3000/api
Swagger docs on http://localhost:3000/api/docs
```

**保持此窗口运行，不要关闭。**

---

### 6.2 启动管理后台（Vue）

打开**新的** PowerShell/CMD 窗口：
```bash
cd C:\你的路径\最终备忘项目\admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```
看到以下输出即成功：
```
Local:   http://localhost:5173/
```
浏览器打开 http://localhost:5173，即可看到登录页。

**保持此窗口运行。**

---

### 6.3 启动移动端（Flutter）

#### 方式 A：安卓模拟器（推荐用于测试）

1. 打开 Android Studio → 右上角 **Device Manager** → 点击【+】创建虚拟设备
2. 选择 **Pixel 7** → 下载一个系统镜像（如 API 34）→ 完成创建
3. 点击【启动】按钮启动模拟器

打开**新的** PowerShell/CMD：
```bash
cd C:\你的路径\最终备忘项目\mobile

# 安装依赖（首次需要较长时间，会从 pub.dev 下载包）
flutter pub get

# 修改 baseUrl（把 localhost 改成你电脑的局域网 IP，或保持 localhost 用模拟器）
# 编辑 mobile\lib\services\api_service.dart
# 将 baseUrl 改为：http://10.0.2.2:3000/api  （模拟器访问宿主机的特殊地址）

# 启动APP
flutter run
```
稍等片刻，APP 会安装到模拟器并自动打开。

#### 方式 B：安卓真机

1. 手机开启 **开发者选项** → 开启 **USB 调试**
2. 用数据线连接电脑
3. 手机上允许 USB 调试
4. 执行 `flutter devices` 确认设备已连接
5. `flutter run`

> 真机连接时，baseUrl 需要填你电脑的局域网 IP（如 `http://192.168.1.100:3000/api`），不能填 localhost。

---

## 七、完整测试流程

### 7.1 测试登录

1. 在模拟器/真机上打开 **心事盒** APP
2. 输入手机号：`13800138000`
3. 点击【获取验证码】
4. 查看后端运行窗口的控制台输出，找到类似：
   ```
   [SMS MOCK] Phone: 13800138000, Code: 123456
   ```
5. 输入验证码 `123456`，点击【登录】
6. 登录成功后进入 **广场** 页面

### 7.2 测试发布笔记

1. 点击右下角 **+** 按钮
2. 填写标题和内容
3. 选择权限：
   - **公开**：所有人可见
   - **私密**：仅自己可见
   - **付费**：输入价格（如 1 元），发布后其他用户需付费查看
4. 点击【发布】
5. 回到广场，下拉刷新，看到刚发布的笔记

### 7.3 测试付费查看

1. 用另一台手机/模拟器注册另一个账号（如 `13900139000`）
2. 在广场找到刚才发布的付费笔记
3. 点击进入，看到内容被遮罩，显示 "解锁查看全文 ¥1.00"
4. 点击解锁按钮
   - iOS：走 Apple IAP（需配置沙箱测试账号，见下方说明）
   - 安卓：由于 `PAY_MOCK=true`，支付直接成功
5. 解锁后看到完整内容

### 7.4 测试提现

1. 回到 **个人中心**
2. 点击【提现】
3. 输入金额（注意单位为**元**，至少 1 元）
4. 输入收款人姓名和账号
5. 点击【提交申请】

### 7.5 测试管理后台

1. 浏览器打开 http://localhost:5173
2. 管理员登录（需先在数据库插入管理员账号，见下方）
3. 查看 **数据概览**、**用户管理**、**提现审核**
4. 在提现审核页面，通过/拒绝刚才的提现申请

#### 初始化管理员账号

打开 MySQL 命令行：
```bash
mysql -u root -p
```
```sql
USE xinshige;
-- 密码是 bcrypt 加密后的 "admin123"
INSERT INTO admin_users (id, username, password_hash, role, is_active, created_at, updated_at)
VALUES (UUID(), 'admin', '$2a$10$YourHashedPasswordHere', 'admin', true, NOW(), NOW());
```

> 注意：实际密码需要用 bcrypt 生成。更简单的做法是运行后端时，在代码中添加一个 seed 脚本，或临时在 AdminService 中写一个创建管理员的接口。

**简易方案**：修改 `backend/src/modules/admin/admin.service.ts` 中的 `login` 方法，临时跳过密码校验，直接返回 token：
```typescript
async login(dto: LoginAdminDto) {
  // 临时方案：自动创建管理员
  let admin = await this.adminRepo.findOne({ where: { username: dto.username } });
  if (!admin) {
    admin = this.adminRepo.create({
      username: dto.username,
      passwordHash: await bcrypt.hash(dto.password, 10),
      role: 'admin',
    });
    await this.adminRepo.save(admin);
  }
  // ... 原有逻辑
}
```
这样第一次登录时会自动创建管理员账号。

---

## 八、iOS 打包方案（无 Mac 电脑）

由于 iOS 打包**必须**使用 Mac + Xcode，以下是 4 种解决方案，按推荐程度排序：

### 方案 1：使用云 Mac 服务（推荐，成本可控）

**MacStadium**（有免费试用期）或 **AWS EC2 Mac Instances**

1. 注册云 Mac 服务，租用一台远程 Mac（约 $1~2/小时，按小时计费）
2. 通过远程桌面连接（VNC/TeamViewer）
3. 在远程 Mac 上安装 Flutter、Xcode
4. 将你的 `mobile/` 源码上传到远程 Mac
5. 在远程 Mac 上执行：
   ```bash
   cd mobile
   flutter pub get
   flutter build ios --release
   cd ios
   pod install
   open Runner.xcworkspace
   ```
6. 在 Xcode 中配置你的 Apple Developer 账号 → Product → Archive → 导出 IPA

### 方案 2：使用 Codemagic CI/CD（推荐，自动化）

**Codemagic** 是 Flutter 官方推荐的 CI/CD 服务，**每月有免费额度**。

1. 注册 https://codemagic.io（可用 GitHub 账号登录）
2. 将你的代码推送到 GitHub/GitLab 仓库
3. 在 Codemagic 中配置：
   - 关联代码仓库
   - 配置 Apple Developer 证书和 Provisioning Profile
   - 配置工作流：Build → iOS Release
4. Codemagic 自动在云端 Mac 上编译，输出 IPA 文件
5. 下载 IPA，通过 TestFlight 或 Ad Hoc 分发

**优点**：完全自动化，不需要自己维护 Mac。  
**缺点**：需要配置证书，首次设置约 30 分钟。

### 方案 3：GitHub Actions（免费，适合技术用户）

在项目根目录创建 `.github/workflows/build-ios.yml`：

```yaml
name: Build iOS
on: [workflow_dispatch]
jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'
      - run: cd mobile && flutter pub get
      - run: cd mobile && flutter build ios --release --no-codesign
      # 后续可配置签名和导出IPA
```

在 GitHub 仓库的 **Actions** 页面手动触发工作流。

### 方案 4：找第三方代打包服务（最省事）

在闲鱼/淘宝搜索 "iOS 打包 "或"Flutter 打包"，提供：
- 完整的 `mobile/` 源码
- 你的 Apple Developer 账号
- Bundle ID（如 `com.xinshige.app`）

对方用他们的 Mac 帮你打包，收费通常在 50~200 元/次。

**注意事项**：
- 务必确认对方只是帮你打包，**不要泄露你的 Apple Developer 账号密码**
- 建议开启双重认证，使用 App 专用密码

---

## 九、常见问题排查

### Q1：`flutter doctor` 提示 Android SDK 找不到
```bash
flutter config --android-sdk "C:\Users\你的用户名\AppData\Local\Android\Sdk"
```

### Q2：`npm install` 特别慢或失败
```bash
# 使用国内镜像
npm config set registry https://registry.npmmirror.com
# 或者使用代理
npm config set proxy http://127.0.0.1:你的代理端口
```

### Q3：模拟器上 APP 无法连接后端
- 检查后端是否正常运行（`http://localhost:3000/api/docs` 能否打开）
- 模拟器 baseUrl 必须用 `http://10.0.2.2:3000/api`
- 真机 baseUrl 必须用电脑的局域网 IP
- 检查 Windows 防火墙是否放行 3000 端口

### Q4：MySQL 连接失败
- 确认 MySQL 服务已启动（任务管理器 → 服务 → MySQL80）
- 确认 `.env` 中的密码正确
- 确认 `DB_DATABASE=xinshige` 数据库已创建

### Q5：`flutter pub get` 卡住
```bash
# 配置国内镜像
set PUB_HOSTED_URL=https://pub.flutter-io.cn
set FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
flutter pub get
```

---

## 十、下一步操作建议

| 步骤 | 操作 | 预计耗时 |
|------|------|----------|
| 1 | 按本指南安装所有环境 | 1~2 小时 |
| 2 | 启动后端和管理后台 | 5 分钟 |
| 3 | 启动模拟器，运行 Flutter APP | 10 分钟 |
| 4 | 走一遍 7.1~7.5 测试流程 | 20 分钟 |
| 5 | 安卓打包：`flutter build apk --release` | 5 分钟 |
| 6 | iOS 打包：选择上述 4 种方案之一 | 视方案而定 |
| 7 | 整理源码，移除 `.env` 中的真实密钥，交付给客户 | 30 分钟 |
