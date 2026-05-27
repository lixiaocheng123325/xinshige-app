-- 心事盒APP 数据库初始化脚本
-- 运行方式：mysql -u root -p < database.sql

CREATE DATABASE IF NOT EXISTS xinshige CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE xinshige;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  phone VARCHAR(20) NOT NULL UNIQUE,
  nickname VARCHAR(50),
  avatar VARCHAR(500),
  balance INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 短信验证码表
CREATE TABLE IF NOT EXISTS sms_codes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(10) NOT NULL,
  expire_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_phone_expire (phone, expire_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 笔记表
CREATE TABLE IF NOT EXISTS notes (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  visibility ENUM('private','public','paid') DEFAULT 'public',
  price INT DEFAULT 0,
  author_id CHAR(36) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_author (author_id),
  INDEX idx_visibility (visibility, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 笔记购买记录表
CREATE TABLE IF NOT EXISTS note_purchases (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  note_id CHAR(36) NOT NULL,
  amount INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_note (user_id, note_id),
  INDEX idx_note (note_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  type ENUM('iap','wechat','alipay') NOT NULL,
  amount INT NOT NULL,
  status ENUM('pending','success','failed') DEFAULT 'pending',
  transaction_id VARCHAR(200),
  payload JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 提现申请表
CREATE TABLE IF NOT EXISTS withdrawals (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  amount INT NOT NULL,
  account_name VARCHAR(50) NOT NULL,
  account_number VARCHAR(100) NOT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  admin_id CHAR(36),
  remark VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 后台管理员表
CREATE TABLE IF NOT EXISTS admin_users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(200) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入默认管理员（用户名: admin，密码: admin123）
-- 密码使用 bcrypt 加密， rounds=10
INSERT IGNORE INTO admin_users (username, password_hash, role) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqhmM6JGKpS4G3R1G2JH8YpfB0Bqy', 'admin');
