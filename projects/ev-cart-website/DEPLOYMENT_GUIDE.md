# 道达智能 CRM+ERP 系统部署指南

> 版本：v1.0.0  
> 更新日期：2026-03-12  
> 作者：渔晓白 ⚙️

---

## 📋 目录

1. [系统架构](#系统架构)
2. [环境要求](#环境要求)
3. [快速部署](#快速部署)
4. [配置说明](#配置说明)
5. [数据库初始化](#数据库初始化)
6. [服务启动](#服务启动)
7. [健康检查](#健康检查)
8. [常见问题](#常见问题)

---

## 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx 负载均衡                        │
│              SSL/HTTPS + 静态资源 + 反向代理             │
└─────────────┬───────────────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼────┐        ┌────▼───┐
│ 官网   │        │ CRM    │  ← 前端应用
│ (Next) │        │(React) │
└────────┘        └────────┘
                        │
              ┌─────────▼─────────┐
              │                   │
         ┌────▼───┐        ┌─────▼────┐
         │  ERP   │        │  后端 API │  ← 后端服务
         │(React) │        │ (NestJS) │
         └────────┘        └─────┬────┘
                                 │
                       ┌─────────▼─────────┐
                       │                   │
                  ┌────▼───┐        ┌─────▼────┐
                  │PostgreSQL│      │  Redis   │  ← 数据存储
                  └────────┘        └──────────┘
```

---

## 环境要求

### 硬件要求

| 组件 | 最低配置 | 推荐配置 |
|-----|---------|---------|
| **CPU** | 4 核 | 8 核+ |
| **内存** | 8GB | 16GB+ |
| **磁盘** | 50GB SSD | 100GB+ SSD |
| **带宽** | 10Mbps | 100Mbps+ |

### 软件要求

| 软件 | 版本 | 说明 |
|-----|------|------|
| **Node.js** | >= 18.0 | 运行时环境 |
| **PostgreSQL** | >= 14.0 | 数据库 |
| **Redis** | >= 6.0 | 缓存 |
| **Nginx** | >= 1.20 | Web 服务器 |
| **Docker** | >= 20.0 (可选) | 容器化部署 |

---

## 快速部署

### 方式一：源码部署

#### 1. 克隆代码

```bash
git clone <repository-url>
cd ev-cart-website
```

#### 2. 安装后端依赖

```bash
cd backend
npm install --production
```

#### 3. 安装前端依赖

```bash
# CRM
cd ../crm
npm install --production

# ERP
cd ../erp-frontend
npm install --production

# 官网
cd ../website
npm install --production
```

#### 4. 构建前端

```bash
# CRM
cd ../crm
npm run build

# ERP
cd ../erp-frontend
npm run build

# 官网
cd ../website
npm run build
```

#### 5. 构建后端

```bash
cd ../backend
npm run build
```

### 方式二：Docker 部署

#### 1. 启动服务

```bash
docker-compose up -d
```

#### 2. 查看状态

```bash
docker-compose ps
```

---

## 配置说明

### 后端配置 (.env)

```bash
# 数据库
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=daoda_crm
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 第三方集成
DINGTALK_APP_KEY=your_app_key
DINGTALK_APP_SECRET=your_app_secret
DINGTALK_AGENT_ID=your_agent_id

# 文件存储
UPLOAD_PATH=/data/uploads
MAX_FILE_SIZE=10485760

# 服务器
PORT=3002
NODE_ENV=production
```

### 前端配置

#### CRM (.env)

```bash
VITE_API_BASE_URL=/api
VITE_APP_TITLE=道达智能 CRM
```

#### ERP (.env)

```bash
VITE_API_BASE_URL=/api/erp
VITE_APP_TITLE=道达智能 ERP
```

#### 官网 (.env)

```bash
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_SITE_TITLE=道达智能
```

---

## 数据库初始化

### 1. 创建数据库

```sql
CREATE DATABASE daoda_crm
  WITH ENCODING = 'UTF8'
  LC_COLLATE = 'en_US.UTF-8'
  LC_CTYPE = 'en_US.UTF-8';
```

### 2. 运行迁移

```bash
cd backend
npm run typeorm migration:run
```

### 3. 初始化数据

```bash
npm run seed
```

---

## 服务启动

### 后端服务

```bash
cd backend
pm2 start dist/main.js --name daoda-api
```

### 前端服务

#### 方案一：Nginx 静态托管

```nginx
server {
    listen 80;
    server_name crm.example.com;
    
    root /var/www/crm/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 方案二：Node.js 服务

```bash
# CRM
cd crm
pm2 start npm --name daoda-crm -- run serve

# ERP
cd erp-frontend
pm2 start npm --name daoda-erp -- run serve

# 官网
cd website
pm2 start npm --name daoda-web -- run start
```

### 启动所有服务

```bash
pm2 start pm2.config.js
pm2 save
pm2 startup
```

---

## 健康检查

### API 健康检查

```bash
curl http://localhost:3002/health
```

**响应**:
```json
{
  "status": "healthy",
  "database": true,
  "redis": true,
  "memory": 45.2,
  "uptime": 86400,
  "timestamp": 1234567890
}
```

### 前端检查

```bash
curl http://localhost:3000
curl http://localhost:3001
curl http://localhost:3003
```

---

## 常见问题

### 1. 数据库连接失败

**问题**: `Error: connect ECONNREFUSED`

**解决**:
```bash
# 检查 PostgreSQL 状态
systemctl status postgresql

# 重启 PostgreSQL
systemctl restart postgresql

# 检查配置
cat /etc/postgresql/14/main/pg_hba.conf
```

### 2. 端口被占用

**问题**: `Error: listen EADDRINUSE`

**解决**:
```bash
# 查看占用端口的进程
lsof -i :3002

# 杀死进程
kill -9 <PID>
```

### 3. 内存不足

**问题**: `JavaScript heap out of memory`

**解决**:
```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
```

### 4. 文件上传失败

**问题**: `Request entity too large`

**解决**:
```nginx
# Nginx 配置
client_max_body_size 10M;
```

---

## 监控与维护

### 日志查看

```bash
# 查看所有日志
pm2 logs

# 查看特定服务日志
pm2 logs daoda-api

# 清空日志
pm2 flush
```

### 性能监控

```bash
# 查看服务状态
pm2 status

# 查看详细信息
pm2 show daoda-api

# 重启服务
pm2 restart daoda-api
```

### 数据备份

```bash
# 数据库备份
pg_dump -U postgres daoda_crm > backup_$(date +%Y%m%d).sql

# Redis 备份
redis-cli BGSAVE
```

---

## 安全加固

### 1. 防火墙配置

```bash
# 开放必要端口
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp

# 启用防火墙
ufw enable
```

### 2. SSL 配置

```bash
# 使用 Let's Encrypt
certbot --nginx -d crm.example.com
```

### 3. 数据库安全

```sql
-- 创建专用用户
CREATE USER daoda_app WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE daoda_crm TO daoda_app;
GRANT USAGE ON SCHEMA public TO daoda_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO daoda_app;
```

---

_道达智能 · 版权所有_
