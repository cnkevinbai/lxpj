# iov-platform 部署指南

**版本**: 1.0.0  
**更新日期**: 2026-03-25  
**维护者**: 渔晓白

---

## 1. 系统要求

### 1.1 硬件要求

| 组件 | 最低配置 | 推荐配置 |
|------|----------|----------|
| **CPU** | 4 核 | 8 核 |
| **内存** | 8 GB | 16 GB |
| **存储** | 100 GB SSD | 500 GB SSD |
| **网络** | 100 Mbps | 1 Gbps |

### 1.2 软件要求

| 软件 | 版本要求 |
|------|----------|
| **操作系统** | Ubuntu 22.04 LTS / CentOS 8+ |
| **Docker** | 24.0+ |
| **Docker Compose** | 2.20+ |
| **Kubernetes** | 1.28+ (可选) |
| **Java** | OpenJDK 17 |
| **Node.js** | 18 LTS |
| **PostgreSQL** | 15+ |
| **Redis** | 7.x |
| **EMQX** | 5.x |
| **Nginx** | 1.24+ |

---

## 2. 部署架构

### 2.1 单机部署架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Nginx (反向代理)                            │
│                        :80 / :443                                  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Frontend   │       │  Backend    │       │   EMQX      │
│  (React)    │       │ (Spring)    │       │  (MQTT)     │
│  :3000      │       │  :8080      │       │  :1883      │
└─────────────┘       └─────────────┘       └─────────────┘
         │                     │
         └──────────┬──────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
    ▼               ▼               ▼
┌───────┐     ┌─────────┐     ┌─────────┐
│Redis  │     │PostgreSQL│    │ TimescaleDB│
│ :6379 │     │  :5432  │     │  :5432   │
└───────┘     └─────────┘     └─────────┘
```

### 2.2 集群部署架构

```
                    ┌─────────────┐
                    │   负载均衡   │
                    │  (Nginx/HAProxy)
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
    │  API-1  │       │  API-2  │       │  API-3  │
    │ :8080   │       │ :8080   │       │ :8080   │
    └────┬────┘       └────┬────┘       └────┬────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
    ▼                      ▼                      ▼
┌─────────┐          ┌─────────┐          ┌─────────┐
│PostgreSQL│          │  Redis  │          │  EMQX   │
│ Cluster │          │ Cluster │          │ Cluster │
└─────────┘          └─────────┘          └─────────┘
```

---

## 3. Docker Compose 部署

### 3.1 目录结构

```
iov-platform/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env
├── nginx/
│   └── nginx.conf
├── backend/
│   └── Dockerfile
├── frontend/
│   └── Dockerfile
└── scripts/
    ├── init-db.sql
    └── deploy.sh
```

### 3.2 docker-compose.yml

```yaml
version: '3.8'

services:
  # PostgreSQL 数据库
  postgres:
    image: postgres:15-alpine
    container_name: iov-postgres
    environment:
      POSTGRES_DB: iov_platform
      POSTGRES_USER: ${DB_USER:-iov}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-iov123456}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-iov}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - iov-network

  # Redis 缓存
  redis:
    image: redis:7-alpine
    container_name: iov-redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - iov-network

  # EMQX 消息服务器
  emqx:
    image: emqx/emqx:5.1.0
    container_name: iov-emqx
    environment:
      - EMQX_NAME=iov_emqx
      - EMQX_HOST=0.0.0.0
    ports:
      - "1883:1883"    # MQTT
      - "8083:8083"    # WebSocket
      - "18083:18083"  # Dashboard
    volumes:
      - emqx_data:/opt/emqx/data
      - emqx_log:/opt/emqx/log
    networks:
      - iov-network

  # 后端服务
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: iov-backend
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=iov_platform
      - DB_USER=${DB_USER:-iov}
      - DB_PASSWORD=${DB_PASSWORD:-iov123456}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - EMQX_HOST=emqx
      - EMQX_PORT=1883
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - iov-network
    restart: unless-stopped

  # 前端服务
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: iov-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - iov-network
    restart: unless-stopped

  # Nginx 反向代理
  nginx:
    image: nginx:1.24-alpine
    container_name: iov-nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - backend
    networks:
      - iov-network
    restart: unless-stopped

networks:
  iov-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  emqx_data:
  emqx_log:
```

### 3.3 环境变量 (.env)

```bash
# 数据库配置
DB_USER=iov
DB_PASSWORD=iov123456
DB_NAME=iov_platform

# JWT 密钥
JWT_SECRET=your-jwt-secret-key-change-in-production

# 管理员账号
ADMIN_EMAIL=admin@daod.com
ADMIN_PASSWORD=admin123456

# EMQX 配置
EMQX_DASHBOARD_USER=admin
EMQX_DASHBOARD_PASSWORD=admin123
```

### 3.4 部署脚本

```bash
#!/bin/bash

# deploy.sh - 部署脚本

set -e

echo "🚀 开始部署 iov-platform..."

# 1. 检查环境
echo "📋 检查环境..."
command -v docker >/dev/null 2>&1 || { echo "❌ 需要安装 Docker"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ 需要安装 Docker Compose"; exit 1; }

# 2. 创建环境文件
if [ ! -f .env ]; then
    echo "📝 创建环境文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件配置生产环境参数"
fi

# 3. 构建镜像
echo "🔨 构建 Docker 镜像..."
docker-compose build

# 4. 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 5. 等待服务就绪
echo "⏳ 等待服务启动..."
sleep 30

# 6. 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

# 7. 初始化数据库
echo "📊 初始化数据库..."
docker-compose exec -T postgres psql -U iov -d iov_platform -f /docker-entrypoint-initdb.d/init.sql

echo "✅ 部署完成!"
echo ""
echo "访问地址:"
echo "  前端: http://localhost"
echo "  后端 API: http://localhost:8080"
echo "  EMQX Dashboard: http://localhost:18083"
```

---

## 4. Kubernetes 部署

### 4.1 Namespace

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: iov-platform
```

### 4.2 ConfigMap

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: iov-config
  namespace: iov-platform
data:
  SPRING_PROFILES_ACTIVE: "prod"
  DB_HOST: "postgres-service"
  DB_PORT: "5432"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
```

### 4.3 Secret

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: iov-secret
  namespace: iov-platform
type: Opaque
stringData:
  DB_USER: iov
  DB_PASSWORD: iov123456
  JWT_SECRET: your-jwt-secret-key
```

### 4.4 Deployment

```yaml
# deployment-backend.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: iov-backend
  namespace: iov-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: iov-backend
  template:
    metadata:
      labels:
        app: iov-backend
    spec:
      containers:
      - name: backend
        image: daod/iov-backend:1.0.0
        ports:
        - containerPort: 8080
        envFrom:
        - configMapRef:
            name: iov-config
        - secretRef:
            name: iov-secret
        resources:
          requests:
            cpu: "500m"
            memory: "1Gi"
          limits:
            cpu: "1000m"
            memory: "2Gi"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 5
```

### 4.5 Service

```yaml
# service-backend.yaml
apiVersion: v1
kind: Service
metadata:
  name: iov-backend-service
  namespace: iov-platform
spec:
  selector:
    app: iov-backend
  ports:
  - port: 8080
    targetPort: 8080
  type: ClusterIP
```

### 4.6 Ingress

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: iov-ingress
  namespace: iov-platform
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - iov.daod.com
    secretName: iov-tls
  rules:
  - host: iov.daod.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: iov-backend-service
            port:
              number: 8080
      - path: /
        pathType: Prefix
        backend:
          service:
            name: iov-frontend-service
            port:
              number: 80
```

---

## 5. 运维指南

### 5.1 日常运维命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend
docker-compose logs -f frontend

# 重启服务
docker-compose restart backend

# 更新镜像
docker-compose pull backend
docker-compose up -d backend

# 备份数据库
docker-compose exec postgres pg_dump -U iov iov_platform > backup_$(date +%Y%m%d).sql

# 恢复数据库
cat backup.sql | docker-compose exec -T postgres psql -U iov iov_platform
```

### 5.2 监控指标

| 指标 | 说明 | 告警阈值 |
|------|------|----------|
| CPU 使用率 | 容器 CPU | > 80% |
| 内存使用率 | 容器内存 | > 85% |
| 磁盘使用率 | 存储空间 | > 80% |
| 请求延迟 | API 响应时间 | > 500ms |
| 错误率 | 5xx 错误比例 | > 1% |
| 数据库连接数 | 活跃连接 | > 80% 连接池 |

### 5.3 日志管理

```yaml
# 日志收集配置 (Filebeat)
filebeat.inputs:
- type: container
  paths:
    - /var/lib/docker/containers/*/*.log
  processors:
  - add_docker_metadata:
      host: "unix:///var/run/docker.sock"

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  index: "iov-logs-%{+yyyy.MM.dd}"
```

---

## 6. 安全配置

### 6.1 网络安全

```yaml
# 网络安全组规则
入站规则:
  - 端口: 80/443 (HTTP/HTTPS)
  - 端口: 1883 (MQTT)
  - 端口: 8083 (WebSocket)
  
禁止:
  - 直接暴露数据库端口
  - 直接暴露 Redis 端口
  - 直接暴露管理端口
```

### 6.2 SSL/TLS 配置

```nginx
# nginx/ssl.conf
ssl_certificate /etc/nginx/ssl/iov.daod.com.crt;
ssl_certificate_key /etc/nginx/ssl/iov.daod.com.key;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers on;
```

---

## 7. 故障排查

### 7.1 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 服务无法启动 | 端口冲突 | 检查端口占用 |
| 数据库连接失败 | 配置错误 | 检查环境变量 |
| MQTT 连接断开 | 网络问题 | 检查防火墙 |
| 前端白屏 | API 异常 | 检查后端日志 |

### 7.2 诊断命令

```bash
# 检查容器日志
docker logs iov-backend --tail 100

# 进入容器调试
docker exec -it iov-backend /bin/sh

# 检查网络连通性
docker exec iov-backend ping postgres

# 检查端口监听
netstat -tlnp | grep 8080
```

---

## 8. 版本升级

### 8.1 升级步骤

```bash
# 1. 备份数据
./scripts/backup.sh

# 2. 拉取新镜像
docker-compose pull

# 3. 停止旧服务
docker-compose down

# 4. 启动新服务
docker-compose up -d

# 5. 验证升级
curl http://localhost:8080/health
```

---

_文档维护：渔晓白_  
_最后更新：2026-03-25_