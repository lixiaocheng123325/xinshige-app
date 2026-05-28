# 小白教程：Codemagic 免费打包 iOS IPA（一步一步跟着做）

> 目标：用免费的 Codemagic 服务打出 iOS 安装包（IPA）
>
> 预计时间：20-30 分钟（含注册账号）
> 预计花费：**0 元**（Codemagic 每月免费 500 分钟）

---

## 第一步：注册 GitHub 账号（3分钟）

### 1.1 打开 GitHub 官网

电脑浏览器访问：https://github.com/

### 1.2 点击"Sign up"

页面右上角点击 **"Sign up"**（注册）。

### 1.3 填写注册信息

| 项目 | 填什么 |
|------|--------|
| Email | 你的邮箱 |
| Password | 设置密码 |
| Username | 英文用户名，比如 `shuangyuapp` |

填完后点 **"Continue"**，按提示完成验证（可能会有图片验证）。

### 1.4 验证邮箱

去你的邮箱，找到 GitHub 发来的邮件，点击里面的 **"Verify email address"** 按钮。

### 1.5 登录 GitHub

回到 https://github.com/，右上角点击 **"Sign in"**，输入用户名和密码登录。

---

## 第二步：安装 Git（Windows 电脑）（3分钟）

Git 是用来把代码传到 GitHub 的工具。

### 2.1 下载 Git

电脑浏览器访问：https://git-scm.com/download/win

页面会自动识别你是 Windows，显示 **"Click here to download"**，点击下载。

### 2.2 安装 Git

下载后双击安装：
1. 点 **"Next"**
2. 点 **"Next"**
3. 点 **"Next"**
4. ...（一路 Next，全部默认）
5. 最后点 **"Install"**
6. 安装完成后点 **"Finish"**

---

## 第三步：把代码上传到 GitHub（5分钟）

### 3.1 打开 Git Bash

在电脑桌面或文件夹空白处，**右键** → 选择 **"Git Bash Here"**。

会弹出一个黑色窗口。

### 3.2 进入项目目录

在黑色窗口里输入：

```bash
cd "/c/Users/Lenovo/Desktop/最终备忘项目"
```

按回车。

### 3.3 配置 Git 用户名和邮箱

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的注册邮箱"
```

把"你的GitHub用户名"和"你的注册邮箱"换成你真实的，按回车。

### 3.4 在 GitHub 上创建新仓库

1. 浏览器打开 https://github.com
2. 登录后，右上角 **"+"** 号 → 点击 **"New repository"**
3. Repository name 输入：`xinshige-app`
4. 下面选 **"Public"**（公开的，Codemagic 免费版需要公开仓库）
5. 点击最下方绿色按钮 **"Create repository"**
6. 创建成功后，页面会显示一个链接，比如 `https://github.com/shuangyuapp/xinshige-app.git`，**复制这个链接**

### 3.5 推送代码

回到 Git Bash 黑色窗口，依次输入下面三条命令（每条按回车）：

```bash
git remote add origin https://github.com/你的用户名/xinshige-app.git
git branch -M main
git push -u origin main
```

> 💡 执行 `git push` 时会提示输入用户名和密码，输入你的 GitHub 用户名和密码。
> 如果密码输错，会报错，重新输一次。

等待上传完成（约 1-2 分钟），看到类似 `Writing objects: 100%` 就说明成功了。

---

## 第四步：注册 Codemagic（2分钟）

### 4.1 打开 Codemagic

电脑浏览器访问：https://codemagic.io/start/

### 4.2 用 GitHub 登录

点击 **"Sign up with GitHub"**，授权登录。

### 4.3 验证邮箱

Codemagic 会发一封邮件到你 GitHub 绑定的邮箱，去邮箱点击验证链接。

---

## 第五步：在 Codemagic 上构建 IPA（10分钟）

### 5.1 添加应用

1. 登录 Codemagic 后，点击 **"Add application"**
2. 选择 **GitHub**
3. 找到你的仓库 `xinshige-app`，点击它
4. 选择 **Flutter App**
5. 点击右下角 **"Select application"**

### 5.2 开始构建

1. 进入项目页面后，左边菜单点击 **"Builds"**
2. 点击右上角 **"Start new build"**
3. Workflow 选择 **`ios-build`**（会自动识别 `codemagic.yaml`）
4. Branch 选择 **`main`**
5. 点击绿色按钮 **"Start new build"**

### 5.3 等待构建完成

页面会显示构建进度：
- Installing dependencies
- Building iOS IPA
- ...

约 **10-15 分钟**后，状态变成 **"Build finished"**（绿色）。

---

## 第六步：下载 IPA

构建完成后：

1. 点击构建记录进入详情页
2. 找到 **"Artifacts"**（构建产物）区域
3. 会看到 `app-release.ipa` 文件
4. 点击 **"Download"** 下载到电脑

**IPA 就在你电脑里了！**

---

## 关于签名的说明

你下载的 IPA 是**未签名**的，这意味着：

- ❌ 不能直接安装到 iPhone（系统会拒绝）
- ❌ 不能提交 App Store

**这是正常的！** 客户合同里也说了上架是他自己负责。

客户拿到未签名 IPA 后，需要：
1. 注册 Apple Developer 账号（¥688/年）
2. 在苹果开发者网站创建证书
3. 用证书给 IPA 重新签名
4. 签名后的 IPA 才能安装和提交审核

**或者更简单的方式：** 客户注册好 Apple Developer 账号后，把他的证书发给你，你在 Codemagic 里配置好，打出来的就是**已签名**的 IPA。

---

## 常见问题

| 问题 | 解决方法 |
|------|---------|
| GitHub 注册收不到邮件 | 检查垃圾邮件箱 |
| `git push` 失败 | 检查用户名密码，或网络 |
| Codemagic 找不到仓库 | 确认仓库是 Public（公开的） |
| 构建失败 | 点击构建记录看红色报错，截图发给我 |
| 下载的 IPA 在哪里 | 在浏览器默认下载文件夹（一般是"下载"） |

---

**两份教程都做完后，你手里就有：**
- ✅ Android APK（可安装到任何安卓手机）
- ✅ iOS IPA（未签名，客户上架前需自行签名）

可以交付给客户了！
