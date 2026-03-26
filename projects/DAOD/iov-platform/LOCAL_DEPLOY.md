# iov-platform 本地部署指南

## 快速开始

### 方式一：仅启动数据库（推荐用于开发测试）

```bash
cd /home/3844778_wy/.openclaw/workspace/projects/DAOD/iov-platform

# 启动数据库和 Redis
./scripts/start-db.sh
```

这将启动：
- PostgreSQL (端口 5432)
- Redis (端口 6379)

然后可以本地运行前后端进行开发调试。

---

### 方式二：完整 Docker 部署

```bash
cd /home/3844778_wy/.openclaw/workspace/projects/DAOD/iov-platform

# 完整部署
./scripts/deploy-local.sh
```

---

## 服务端口

| 服务 | 端口 | 说明 |
|------|------|------|
| PostgreSQL | 5432 | 数据库 |
| Redis | 6379 | 缓存 |
| EMQX | 1883 | MQTT |
| EMQX Dashboard | 18083 | 管理界面 |
| 后端 API | 8080 | Spring Boot |
| 前端 | 3000 | React |
| Nginx | 80 | 反向代理 |

---

## 默认账号

| 系统 | 账号 | 密码 |
|------|------|------|
| 管理员 | admin@daod.com | admin123 |
| 数据库 | iov | iov123456 |
| EMQX | admin | public |

---

## 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend
docker-compose logs -f postgres

# 停止所有服务
docker-compose down

# 重启服务
docker-compose restart backend

# 进入数据库
docker-compose exec postgres psql -U iov -d iov_platform

# 查看数据库表
docker-compose exec postgres psql -U iov -d iov_platform -c "\dt"
```

---

## 数据库连接

```bash
# 连接信息
Host: localhost
Port: 5432
Database: iov_platform
User: iov
Password: iov123456

# 使用 psql 连接
psql -h localhost -U iov -d iov_platform
```

---

## 前端开发

```bash
cd /home/3844778_wy/.openclaw/workspace/projects/DAOD/iov-platform/web/iov-portal

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run type-check
```

---

## 故障排查

### 数据库连接失败

```bash
# 检查数据库状态
docker-compose ps postgres

# 重启数据库
docker-compose restart postgres
```

### 端口冲突

```bash
# 检查端口占用
netstat -tlnp | grep 5432
netstat -tlnp | grep 6379
netstat -tlnp | grep 8080
```

### 清理并重新部署

```bash
# 停止并删除所有容器
docker-compose down -v

# 重新部署
./scripts/deploy-local.sh
```