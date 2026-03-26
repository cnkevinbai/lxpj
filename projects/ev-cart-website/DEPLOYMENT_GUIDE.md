# 部署指南

**版本**: 3.0.0  
**更新时间**: 2026-03-14  
**维护人**: 渔晓白 ⚙️

---

## 📋 系统要求

### 硬件要求
- CPU: 4 核以上
- 内存：8GB 以上
- 硬盘：50GB 以上
- 网络：100Mbps 以上

### 软件要求
- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (开发用)

---

## 🚀 一键部署

### Step 1: 克隆代码
```bash
git clone <repository-url> daoda-system
cd daoda-system
```

### Step 2: 配置环境变量
```bash
cp .env.example .env
vim .env  # 修改配置
```

**必要配置**:
- `DB_PASSWORD` - 数据库密码
- `REDIS_PASSWORD` - Redis 密码
- `JWT_SECRET` - JWT 密钥

### Step 3: 执行部署
```bash
chmod +x deploy.sh
./deploy.sh
```

### Step 4: 验证部署
```bash
docker-compose ps
```

所有服务状态应为 `Up`

---

## 📱 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 官网 | http://localhost | 对外展示 |
| 门户 | http://localhost/portal | 内部系统 |
| API | http://localhost/api | 后端接口 |

---

## 🔧 常用命令

### 查看服务状态
```bash
docker-compose ps
```

### 查看日志
```bash
# 所有服务
docker-compose logs -f

# 特定服务
docker-compose logs -f api
docker-compose logs -f nginx
```

### 重启服务
```bash
# 重启所有
docker-compose restart

# 重启特定服务
docker-compose restart api
```

### 停止服务
```bash
docker-compose down
```

### 更新部署
```bash
# 拉取最新代码
git pull

# 重新构建
docker-compose build

# 重启服务
docker-compose up -d
```

---

## 📊 服务架构

```
┌─────────────────────────────────────────────────────────┐
│                      Nginx (80/443)                     │
│                    反向代理 + SSL                       │
└─────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Frontend   │    │     API      │    │   WebSocket  │
│   React 18   │    │   NestJS     │    │              │
│   (80)       │    │   (3001)     │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │
        │                     │
        ▼                     ▼
┌──────────────┐    ┌──────────────┐
│   PostgreSQL │    │    Redis     │
│   (5432)     │    │    (6379)    │
└──────────────┘    └──────────────┘
```

---

## 🔒 安全配置

### 1. 修改默认密码
```bash
# .env 文件
DB_PASSWORD=强密码
REDIS_PASSWORD=强密码
JWT_SECRET=随机字符串
```

### 2. 配置 SSL（可选）
```bash
# 获取 SSL 证书
certbot --nginx -d your-domain.com

# 启用 nginx/conf.d/https.conf
```

### 3. 防火墙配置
```bash
# 只开放必要端口
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## 📈 性能优化

### 1. 数据库优化
```sql
-- 创建索引
CREATE INDEX idx_customers_name ON crm_customers(name);
CREATE INDEX idx_orders_status ON crm_orders(status);

-- 定期清理
VACUUM ANALYZE;
```

### 2. Redis 缓存
```bash
# 配置最大内存
maxmemory 2gb
maxmemory-policy allkeys-lru
```

### 3. Nginx 优化
```nginx
# 启用缓存
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m;

# Gzip 压缩
gzip on;
gzip_min_length 1024;
```

---

## 🐛 故障排查

### 服务启动失败
```bash
# 查看日志
docker-compose logs [service]

# 检查配置
docker-compose config

# 重新构建
docker-compose build --no-cache
```

### 数据库连接失败
```bash
# 检查数据库状态
docker-compose ps postgres

# 查看数据库日志
docker-compose logs postgres

# 测试连接
docker-compose exec postgres psql -U daoda -d daoda
```

### API 无法访问
```bash
# 检查 API 状态
curl http://localhost:3001/health

# 查看 API 日志
docker-compose logs api

# 检查网络
docker-compose exec api ping postgres
```

---

## 📚 相关文档

- [架构重构计划 v3.1](./ARCHITECTURE_REFACTOR_PLAN_v3.md)
- [PHASE3_DEPLOYMENT_COMPLETE.md](./portal/PHASE3_DEPLOYMENT_COMPLETE.md)
- [系统总览](./SYSTEM_OVERVIEW.md)

---

**部署完成！开始使用道达智能系统！** 🚀

**维护人**: 渔晓白 ⚙️  
**更新时间**: 2026-03-14
