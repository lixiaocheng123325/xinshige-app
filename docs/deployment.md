# 心事盒APP — 部署文档

## 一、环境依赖

| 组件 | 推荐版本 | 说明 |
|------|----------|------|
| Node.js | v18+ | 后端与管理后台运行环境 |
| MySQL | 8.0+ | 数据库 |
| Flutter | 3.x | 移动端编译 |
| Dart | 随Flutter一起安装 |  |
| Java JDK | 17+ | Android打包需要 |
| Xcode | 15+ | iOS打包需要（仅Mac） |

## 二、后端部署（NestJS）

```bash
cd backend
cp .env.example .env
# 编辑 .env 文件，填写数据库配置、JWT密钥、第三方API密钥
npm install
npm run start:dev   # 开发模式
npm run start:prod  # 生产模式（需先 npm run build）
```

服务启动后访问：
- API 根地址：`http://localhost:3000/api`
- Swagger 文档：`http://localhost:3000/api/docs`

## 三、管理后台部署（Vue）

```bash
cd admin
cp .env.example .env  # 如需自定义API地址
npm install
npm run dev     # 开发模式
npm run build   # 生产打包，输出 dist/ 目录，用 Nginx 托管
```

## 四、移动端编译

### 安卓

```bash
cd mobile
flutter pub get
flutter build apk --release    # 输出 APK
flutter build appbundle --release  # 输出 AAB（Google Play）
```

### iOS

```bash
cd mobile
flutter pub get
cd ios
pod install
cd ..
flutter build ios --release
# 在 Xcode 中打开 ios/Runner.xcworkspace → Product → Archive → 导出
```

## 五、数据库初始化

后端首次启动时，如果 `synchronize: true`，TypeORM 会自动建表。
生产环境建议关闭 synchronize，使用 migration：

```bash
npm run migration:run
```

## 六、配置文件说明

详见各工程目录下的 `.env.example` 文件，所有敏感配置项均有注释说明获取方式。
