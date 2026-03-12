# EV Cart 系统部署指南

> 生产环境部署完整指南

## 📋 前置要求

- Node.js 18+
- PostgreSQL 14+
- Nginx（可选）
- Docker（可选）

## 🚀 快速部署

### 1. 数据库初始化

```bash
# 创建数据库
sudo -u postgres psql -c "CREATE DATABASE evcart;"
sudo -u postgres psql -c "CREATE USER evcart WITH PASSWORD 'evcart123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE evcart TO evcart;"

# 执行迁移脚本
cd database/migrations
for file in *.sql; do
  sudo -u postgres psql -d evcart -f $file
done
```

### 2. 后端部署

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等

# 构建
npm run build

# 启动（开发环境）
npm run start:dev

# 启动（生产环境）
npm run start:prod

# 或使用 PM2
pm2 start dist/main.js --name evcart-api
```

### 3. 前端部署

```bash
cd crm

# 安装依赖
npm install

# 配置 API 地址
# 编辑 .env 或 vite.config.ts

# 构建
npm run build

# 部署到 Nginx
# 将 dist/ 目录内容复制到 Nginx 网站根目录
```

### 4. Nginx 配置

```nginx
server {
    listen 80;
    server_name crm.evcart.com;

    # 前端静态文件
    location / {
        root /var/www/evcart-crm;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL 证书配置

```bash
# 使用 Let's Encrypt
sudo certbot --nginx -d crm.evcart.com
```

## 🔧 环境变量配置

### 后端 .env

```env
# 数据库
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=evcart
DB_PASSWORD=evcart123
DB_DATABASE=evcart

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# 服务器
PORT=3001
NODE_ENV=production

# 邮件
EMAIL_ENABLED=true
EMAIL_SMTP_HOST=smtp.qq.com
EMAIL_SMTP_PORT=587
EMAIL_USERNAME=noreply@evcart.com
EMAIL_PASSWORD=your-password

# 短信
SMS_ENABLED=false
SMS_PROVIDER=aliyun
```

### 前端 .env

```env
# API 地址
VITE_API_BASE_URL=https://api.evcart.com/api/v1

# 应用配置
VITE_APP_TITLE=EV Cart CRM
VITE_APP_VERSION=1.0.0
```

## 🐳 Docker 部署

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: evcart
      POSTGRES_USER: evcart
      POSTGRES_PASSWORD: evcart123
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/migrations:/docker-entrypoint-initdb.d

  backend:
    build: ./backend
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: evcart
      DB_PASSWORD: evcart123
      DB_DATABASE: evcart
    ports:
      - "3001:3001"
    depends_on:
      - postgres

  frontend:
    build: ./crm
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 启动命令

```bash
docker-compose up -d
```

## 📊 性能优化

### 1. 数据库优化
- 创建索引
- 配置连接池
- 定期 VACUUM

### 2. 后端优化
- 启用缓存（Redis）
- 使用集群模式
- 启用 Gzip 压缩

### 3. 前端优化
- 代码分割
- 图片压缩
- CDN 加速
- 启用缓存

## 🔒 安全配置

### 1. 防火墙
```bash
# 只开放必要端口
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. 数据库安全
- 修改默认端口
- 限制远程访问
- 定期备份

### 3. 应用安全
- 启用 HTTPS
- 配置 CORS
- 设置安全头

## 📝 运维监控

### 1. 日志管理
```bash
# 查看后端日志
pm2 logs evcart-api

# 查看 Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. 性能监控
- 使用 PM2 Monitor
- 配置 Prometheus + Grafana
- 设置告警通知

### 3. 备份策略
```bash
# 数据库备份
pg_dump -U evcart evcart > backup_$(date +%Y%m%d).sql

# 定期备份（crontab）
0 2 * * * pg_dump -U evcart evcart > /backup/evcart_$(date +\%Y\%m\%d).sql
```

## 🆘 故障排查

### 常见问题

1. **数据库连接失败**
   - 检查 PostgreSQL 服务状态
   - 验证连接配置
   - 检查防火墙规则

2. **前端页面空白**
   - 检查浏览器控制台错误
   - 验证 API 地址配置
   - 清除浏览器缓存

3. **API 请求失败**
   - 检查后端服务状态
   - 验证 Token 是否过期
   - 查看 Nginx 配置

## 📞 技术支持

- 文档：https://docs.evcart.com
- 邮箱：support@evcart.com
- 电话：400-888-8888

## 📄 许可证

Copyright © 2026 EV Cart
