# 部署指南

> 四川道达智能车辆制造有限公司  
> 官网 + CRM 系统  
> 版本：v1.0.0  
> 更新时间：2026-03-11

---

## 📋 目录

1. [环境要求](#环境要求)
2. [本地开发](#本地开发)
3. [Docker 部署](#docker-部署)
4. [生产环境部署](#生产环境部署)
5. [域名配置](#域名配置)
6. [SSL 证书](#ssl-证书)
7. [备份与恢复](#备份与恢复)
8. [故障排查](#故障排查)

---

## 环境要求

### 最低配置

| 资源 | 要求 |
|-----|------|
| CPU | 2 核 |
| 内存 | 4GB |
| 硬盘 | 50GB |
| 带宽 | 5Mbps |

### 推荐配置

| 资源 | 要求 |
|-----|------|
| CPU | 4 核 |
| 内存 | 8GB |
| 硬盘 | 100GB SSD |
| 带宽 | 10Mbps |

### 软件要求

| 软件 | 版本 |
|-----|------|
| Node.js | >= 18 |
| PostgreSQL | >= 15 |
| Redis | >= 7 |
| Docker | >= 24 |
| Docker Compose | >= 2.0 |

---

## 本地开发

### 1. 克隆项目

```bash
git clone https://gitee.com/bj754946/pj.git
cd pj
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件
```

### 4. 启动数据库和 Redis

```bash
docker-compose up -d postgres redis
```

### 5. 启动服务

```bash
# 启动后端
cd backend && npm run start:dev

# 启动官网
cd website && npm run dev

# 启动 CRM
cd crm && npm run dev
```

### 6. 访问地址

| 服务 | 地址 |
|-----|------|
| 官网 | http://localhost:3000 |
| CRM | http://localhost:3002 |
| API 文档 | http://localhost:3001/api/docs |

---

## Docker 部署

### 1. 准备环境

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | bash

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置生产环境参数
```

### 3. 启动服务

```bash
docker-compose up -d
```

### 4. 查看状态

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
```

### 5. 停止服务

```bash
docker-compose down
```

### 6. 重启服务

```bash
docker-compose restart
```

---

## 生产环境部署

### 阿里云部署

#### 1. 购买服务器

- 选择 ECS 云服务器
- 推荐配置：4 核 8G 50GB SSD
- 操作系统：Ubuntu 22.04 LTS

#### 2. 配置安全组

| 端口 | 说明 | 状态 |
|-----|------|------|
| 80 | HTTP | 开放 |
| 443 | HTTPS | 开放 |
| 22 | SSH | 开放 |
| 5432 | PostgreSQL | 内网 |
| 6379 | Redis | 内网 |

#### 3. 安装 Docker

```bash
curl -fsSL https://get.docker.com | bash
systemctl enable docker
systemctl start docker
```

#### 4. 部署项目

```bash
# 克隆项目
git clone https://gitee.com/bj754946/pj.git
cd pj

# 配置环境变量
cp .env.example .env
# 编辑 .env

# 启动服务
docker-compose up -d
```

#### 5. 配置 Nginx

```bash
# 安装 Nginx
apt update && apt install -y nginx

# 创建配置文件
cat > /etc/nginx/sites-available/daoda << 'EOF'
server {
    listen 80;
    server_name www.daoda-auto.com daoda-auto.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /crm {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# 启用配置
ln -s /etc/nginx/sites-available/daoda /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 域名配置

### 1. 购买域名

- 推荐平台：阿里云、腾讯云
- 域名建议：daoda-auto.com

### 2. DNS 解析

| 类型 | 主机记录 | 记录值 | 说明 |
|-----|---------|--------|------|
| A | @ | 服务器 IP | 主域名 |
| A | www | 服务器 IP | www 子域名 |
| CNAME | crm | 服务器 IP | CRM 系统 |
| CNAME | api | 服务器 IP | API 接口 |

### 3. ICP 备案

- 登录阿里云/腾讯云备案系统
- 提交备案申请
- 等待审核 (通常 7-20 个工作日)

---

## SSL 证书

### 申请免费证书

#### Let's Encrypt

```bash
# 安装 Certbot
apt install -y certbot python3-certbot-nginx

# 申请证书
certbot --nginx -d daoda-auto.com -d www.daoda-auto.com

# 自动续期
certbot renew --dry-run
```

#### 阿里云免费证书

1. 登录阿里云控制台
2. 搜索"SSL 证书"
3. 申请免费证书
4. 下载证书文件
5. 配置 Nginx

### 配置 HTTPS

```nginx
server {
    listen 443 ssl;
    server_name www.daoda-auto.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name www.daoda-auto.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 备份与恢复

### 数据库备份

```bash
# 备份脚本
cat > /opt/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR

# 备份数据库
docker exec evcart-db pg_dump -U evcart evcart > $BACKUP_DIR/db_$DATE.sql

# 压缩备份
gzip $BACKUP_DIR/db_$DATE.sql

# 删除 7 天前的备份
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /opt/backup-db.sh

# 添加定时任务
crontab -e
# 每天凌晨 2 点备份
0 2 * * * /opt/backup-db.sh
```

### 数据库恢复

```bash
# 解压备份
gunzip db_20260311_020000.sql.gz

# 恢复数据库
docker exec -i evcart-db psql -U evcart evcart < db_20260311_020000.sql
```

### 文件备份

```bash
# 备份 uploads 目录
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz ./uploads
```

---

## 故障排查

### 容器无法启动

```bash
# 查看容器日志
docker-compose logs [service_name]

# 查看容器状态
docker-compose ps

# 重启容器
docker-compose restart [service_name]
```

### 数据库连接失败

```bash
# 检查数据库容器
docker-compose ps postgres

# 查看数据库日志
docker-compose logs postgres

# 测试连接
docker exec evcart-db psql -U evcart -c "SELECT 1"
```

### 端口被占用

```bash
# 查看端口占用
netstat -tlnp | grep 3000

# 修改 .env 中的端口配置
WEBSITE_PORT=3001
```

### 内存不足

```bash
# 查看内存使用
free -h

# 清理 Docker 资源
docker system prune -a

# 增加 Swap
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

---

## 监控告警

### 安装监控

```bash
# 使用 Docker Compose 添加监控服务
docker-compose -f docker-compose.monitoring.yml up -d
```

### 配置告警

- 服务器 CPU > 80%
- 内存使用 > 80%
- 磁盘使用 > 80%
- 服务宕机

---

## 性能优化

### Nginx 优化

```nginx
# 开启 Gzip 压缩
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# 缓存静态资源
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### 数据库优化

```sql
-- 添加索引
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_leads_status ON leads(status);

-- 分析慢查询
EXPLAIN ANALYZE SELECT * FROM customers WHERE status = 'active';
```

---

## 联系支持

| 项目 | 信息 |
|-----|------|
| 技术支持 | tech@daoda-auto.com |
| 紧急联系 | 400-XXX-XXXX |
| 文档地址 | https://docs.daoda-auto.com |

---

_四川道达智能车辆制造有限公司 · 版权所有_
