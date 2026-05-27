# 心事盒APP — 客户交付说明

## 项目概况

- **项目名称**：心事盒（云备忘录APP）
- **技术方案**：Flutter + NestJS + MySQL + Vue 3
- **交付日期**：2026-05-26
- **交付内容**：完整前后端源码 + 文档

## 交付文件说明

```
最终备忘项目/
├── backend/              ← 后端 API 源码（NestJS）
│   ├── database.sql      ← 数据库初始化脚本（一键导入）
│   └── .env.example      ← 配置文件模板
├── mobile/               ← 移动端源码（Flutter）
│   └── android/          ← 安卓工程配置
├── admin/                ← 管理后台源码（Vue 3）
├── docs/                 ← 文档目录
│   ├── windows-setup-guide.md    ← 【先看这个】环境搭建指南
│   ├── deployment.md             ← 部署文档
│   ├── delivery-checklist.md     ← 交付检查清单
│   └── environment.md            ← 环境检查报告
└── README.md             ← 项目说明
```

## 快速开始（3步跑起来）

### 第 1 步：安装环境
详细步骤见 `docs/windows-setup-guide.md`，需要安装：
- Node.js
- MySQL
- Flutter SDK + Android Studio
- Java JDK

### 第 2 步：初始化数据库
```bash
mysql -u root -p < backend/database.sql
```

### 第 3 步：启动三个服务

**终端 1 - 后端：**
```bash
cd backend
cp .env.example .env
# 编辑 .env 填写你的 MySQL 密码
npm install
npm run start:dev
```

**终端 2 - 管理后台：**
```bash
cd admin
npm install
npm run dev
```

**终端 3 - 移动端：**
```bash
cd mobile
flutter pub get
flutter run
```

## 核心功能验证

| 功能 | 验证方式 |
|------|----------|
| 手机号登录 | APP 输入手机号 → 看后端控制台验证码 → 输入登录 |
| 发布笔记 | APP 点击 + → 写内容 → 选权限（公开/私密/付费） |
| 付费查看 | 用另一个账号登录 → 点击付费笔记 → 解锁查看 |
| 支付 | 开发阶段 `PAY_MOCK=true`，支付直接成功 |
| 提现 | APP 个人中心 → 提现 → 输入金额和账号 |
| 后台审核 | 浏览器打开 http://localhost:5173 → 登录 admin / admin123 → 提现审核 |

## 无 Mac 电脑如何打 iOS 包

见 `docs/windows-setup-guide.md` 第八章，推荐方案：

1. **Codemagic（免费额度）**：将你的代码推到 GitHub，在 codemagic.io 配置自动打包
2. **云 Mac 租用**：MacStadium 或 AWS EC2 Mac，按小时付费远程操作
3. **第三方代打**：淘宝/闲鱼搜索 "iOS 打包"，提供源码和开发者账号

## 后续修改指引

### 修改 APP 名称/图标
- **APP 名称**：修改 `mobile/lib/main.dart` 中的 `title: '心事盒'`
- **图标**：替换 `mobile/android/app/src/main/res/mipmap-xxx/` 下的图标文件
- **主题色**：修改 `mobile/lib/main.dart` 中的 `seedColor`

### 修改后端接口地址
- 开发环境：`mobile/lib/services/api_service.dart` 中的 `baseUrl`
- 生产环境：建议用编译变量或配置文件中读取

### 配置真实支付
1. **微信支付**：申请微信商户号 → 在 `.env` 中填写 `WECHAT_APPID`、`WECHAT_MCHID`、`WECHAT_KEY`
2. **支付宝**：申请支付宝企业账号 → 填写 `ALIPAY_APPID`、`ALIPAY_PRIVATE_KEY`
3. **Apple IAP**：在 App Store Connect 创建商品 → 在 APP 端配置 `productId`
4. 关闭 `PAY_MOCK=false`

### 配置真实短信
1. 注册阿里云账号 → 开通短信服务
2. 申请短信签名和模板
3. 在 `.env` 中填写 `SMS_ACCESS_KEY_ID`、`SMS_ACCESS_KEY_SECRET`、`SMS_SIGN_NAME`、`SMS_TEMPLATE_CODE`
4. 关闭 `SMS_MOCK=false`

## 联系方式

如有技术问题，建议：
1. 先查看 `docs/windows-setup-guide.md` 的【常见问题排查】章节
2. 检查后端控制台错误日志
3. 查看 Swagger 文档确认接口正常：http://localhost:3000/api/docs

---

**祝项目顺利上线！**
