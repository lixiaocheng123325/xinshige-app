# Codemagic 自动打包 iOS IPA 指南

## 一、Codemagic 是什么

Codemagic 是专门的移动端 CI/CD 服务，提供 **免费的 macOS 虚拟机** 来打包 iOS APP。

- 免费额度：**500 分钟/月**（打一次 IPA 约 10-15 分钟，够打 30-50 次）
- 不需要自己买 Mac
- 只需要把代码推送到 GitHub/GitLab，Codemagic 自动构建

## 二、操作步骤

### 1. 注册 Codemagic 账号

访问 https://codemagic.io/start/ 用 GitHub 账号登录。

### 2. 把项目代码推送到 GitHub

```bash
# 在项目根目录执行
git remote add origin https://github.com/你的用户名/心事盒.git
git branch -M main
git push -u origin main
```

### 3. 在 Codemagic 中关联项目

1. 登录 Codemagic 后，点击 "Add application"
2. 选择你的 GitHub 仓库（心事盒）
3. 选择 Flutter 作为框架

### 4. 配置构建设置

Codemagic 会自动识别项目中的 `codemagic.yaml` 文件。

我已经在项目根目录写好了 `codemagic.yaml`，你不需要额外配置。

### 5. 开始构建

点击 "Start new build" → 选择 `ios-build` workflow → 开始构建。

约 10-15 分钟后，Codemagic 会生成 IPA 文件并发送到你配置的邮箱。

## 三、重要说明

**关于签名：**
- `codemagic.yaml` 中使用了 `--no-codesign`（不打签名）
- 生成的 IPA **不能** 直接安装到 iPhone 上（未签名）
- 客户上架前需要用 **自己的 Apple Developer 账号** 重新签名

**如果客户要直接安装测试，有两种方式：**

**方式A：TestFlight（推荐）**
- 需要 Apple Developer 账号（¥688/年）
- 在 Codemagic 中配置证书和 Provisioning Profile
- 构建后直接上传到 App Store Connect，通过 TestFlight 分发给测试人员

**方式B：Ad Hoc 分发**
- 需要 Apple Developer 账号
- 注册测试设备的 UDID
- 生成 Ad Hoc 签名的 IPA，用蒲公英/Fir.im 等平台分发

**方式C：企业签名（不推荐）**
- 需要 Apple Enterprise 账号（¥1988/年）
- 可以免设备限制安装，但审核严格，容易掉签

## 四、客户上架前需要做的

1. 注册 Apple Developer 账号（个人 ¥688/年 或 企业 ¥1988/年）
2. 在 Apple Developer Portal 创建 App ID、证书、Provisioning Profile
3. 在 Codemagic 中配置这些证书（或手动用 Xcode 重新签名）
4. 提交到 App Store Connect 审核

> 这些属于上架运营阶段，不在开发交付范围内，按合同客户自己负责。

## 五、常见问题

**Q：为什么 IPA 不签名？**
A：签名需要客户的 Apple Developer 证书，开发阶段无法使用客户的证书。打出未签名 IPA 后，客户上架前用自己的证书重签即可。

**Q：Codemagic 免费额度够用吗？**
A：500 分钟/月，打一次约 10-15 分钟，足够开发和测试阶段使用。

**Q：可以打 Android APK 吗？**
A：可以，但 Linux 云服务器更便宜，推荐用云服务器打 APK（见另一份指南）。
