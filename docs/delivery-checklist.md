# 心事盒APP — 交付检查清单

## 一、源码完整性检查

### 后端 (backend/)
- [ ] `package.json` 完整，依赖正确
- [ ] `.env.example` 已提供，无真实密钥
- [ ] `database.sql` 数据库初始化脚本
- [ ] 7 个 TypeORM 实体文件齐全
- [ ] 6 个模块（Auth/User/Note/Payment/Withdrawal/Admin）Controller/Service/Module 齐全
- [ ] JWT Guard 和 Admin Guard 已配置
- [ ] Swagger 文档可访问

### 移动端 (mobile/)
- [ ] `pubspec.yaml` 依赖完整
- [ ] `lib/main.dart` 入口文件
- [ ] `lib/routes.dart` 路由配置
- [ ] API Service + Storage Service 封装
- [ ] 登录页、首页、笔记详情/编辑、个人中心、提现页
- [ ] `android/app/build.gradle` 签名配置

### 管理后台 (admin/)
- [ ] `package.json` 依赖完整
- [ ] `vite.config.ts` 代理配置
- [ ] Router + Pinia Store 配置
- [ ] API Request 封装（含 Token 注入）
- [ ] Login / Layout / Dashboard / User / Note / Order / Withdrawal 页面

---

## 二、敏感信息清理

- [ ] 所有 `.env` 文件已替换为 `.env.example`
- [ ] 无真实数据库密码、API Key、证书
- [ ] 无开发者个人账号信息
- [ ] 无测试用的真实手机号/银行卡号

---

## 三、文档完整性

- [ ] `README.md` 项目说明
- [ ] `docs/environment.md` 环境检查报告
- [ ] `docs/deployment.md` 部署文档
- [ ] `docs/windows-setup-guide.md` Windows 搭建指南
- [ ] `docs/delivery-checklist.md` 本清单

---

## 四、交付物清单

| 序号 | 交付物 | 状态 |
|------|--------|------|
| 1 | 后端源码 (backend/) | |
| 2 | 移动端源码 (mobile/) | |
| 3 | 管理后台源码 (admin/) | |
| 4 | 数据库初始化脚本 (database.sql) | |
| 5 | 部署文档 | |
| 6 | Windows 环境搭建指南 | |
| 7 | 安卓 APK（如有） | |
| 8 | 安卓 AAB（如有） | |
| 9 | iOS IPA（如有） | |

---

## 五、客户验收流程

1. 按 `windows-setup-guide.md` 安装环境
2. 执行 `database.sql` 初始化数据库
3. 启动后端：`cd backend && npm install && npm run start:dev`
4. 启动后台：`cd admin && npm install && npm run dev`
5. 启动APP：`cd mobile && flutter pub get && flutter run`
6. 测试手机号登录（验证码看后端控制台）
7. 测试发布公开/私密/付费笔记
8. 测试另一账号购买付费笔记
9. 测试提现申请
10. 测试管理后台登录（admin / 任意密码首次自动创建）
11. 测试后台提现审核
