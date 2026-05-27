# 心事盒（云备忘录APP）

基于 Flutter + NestJS + MySQL 的全栈笔记类APP，支持私密/公开/付费查看、用户提现对账、管理后台。

## 项目结构

```
.
├── mobile/          # Flutter APP（安卓 + iOS）
├── backend/         # NestJS 后端 API
├── admin/           # Vue 3 管理后台
└── docs/            # 文档
```

## 核心功能

- 手机号验证码登录/注册
- 笔记发布（私密 / 公开 / 付费查看）
- iOS Apple IAP 内购 / 安卓微信+支付宝支付
- 笔记付费解锁查看
- 用户余额提现
- 管理后台（用户/笔记/订单/提现审核/统计）

## 快速开始

参见 `docs/deployment.md`

## 技术栈

| 端 | 技术 |
|----|------|
| 移动端 | Flutter 3.x + GetX + Dio |
| 后端 | NestJS + TypeORM + MySQL |
| 后台 | Vue 3 + Element Plus + Pinia |

## 交付说明

- 完整前后端源码，可独立部署
- 安卓 release APK + AAB
- iOS Xcode 工程（客户自行签名上架）
- 部署文档
