# 小白教程：GitHub Actions 免费打包 Android APK

> **完全免费！不用租服务器！不用充一分钱！**
>
> GitHub 每月送 2000 分钟免费额度，打一次 APK 只要 10 分钟。

---

## 第一步：注册 GitHub 账号（3分钟）

1. 浏览器访问 https://github.com/
2. 点击右上角 **"Sign up"**
3. 填邮箱、密码、用户名（英文，比如 `shuangyuapp`）
4. 去邮箱验证
5. 回到 https://github.com/ 登录

---

## 第二步：安装 Git（如果还没装）

1. 访问 https://git-scm.com/download/win
2. 下载 **64-bit Git for Windows**
3. 双击安装，全部点 **"Next"**

---

## 第三步：把代码推送到 GitHub

### 3.1 在 GitHub 上创建仓库

1. 登录 GitHub 后，右上角 **"+"** → **"New repository"**
2. Repository name 填：`xinshige-app`
3. 选 **"Public"**（公开仓库才能用免费 GitHub Actions）
4. 点击 **"Create repository"**
5. 创建成功后，页面显示一个链接：`https://github.com/你的用户名/xinshige-app.git`

### 3.2 推送代码

在电脑桌面空白处 **右键** → **"Git Bash Here"**，输入：

```bash
cd "/c/Users/Lenovo/Desktop/最终备忘项目"
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的邮箱"
git remote add origin https://github.com/你的用户名/xinshige-app.git
git branch -M main
git push -u origin main
```

> 提示输入密码时，输入 GitHub 密码。

等 1-2 分钟，代码就传到 GitHub 了。

---

## 第四步：运行 GitHub Actions 自动打包（2分钟）

### 4.1 进入 Actions 页面

1. 浏览器打开你的仓库页面：`https://github.com/你的用户名/xinshige-app`
2. 点击上方菜单 **"Actions"**

### 4.2 启动打包

1. 左边列表点击 **"Build Android APK"**
2. 右边点击 **"Run workflow"** 下拉按钮
3. 再点击绿色的 **"Run workflow"**

### 4.3 等待打包完成

页面会显示一个黄色的进度条，约 **10-15 分钟**后变成绿色对勾 ✅。

---

## 第五步：下载 APK

打包完成后：

1. 点击完成的构建记录
2. 页面下方找到 **"Artifacts"** 区域
3. 看到 `app-release-apk`，点击下载
4. ZIP 文件下载到电脑，解压后就是 `app-release.apk`

**APK 到手！可以直接发给客户！**

---

## 费用说明

| 项目 | 费用 |
|------|------|
| GitHub 账号 | 免费 |
| GitHub Actions | 免费（每月2000分钟） |
| 打一次 APK | 约10分钟，**0元** |

---

## 如果以后要重新打包

客户要求改东西，你改完代码后：

1. `git add -A`
2. `git commit -m "修改了xxx"`
3. `git push`
4. 回到 GitHub Actions 页面，点 **"Run workflow"**

又自动打出新的 APK，还是 **0元**。

---

**下一步：打 iOS IPA → 看《小白教程-Codemagic打包iOS-IPA》**
