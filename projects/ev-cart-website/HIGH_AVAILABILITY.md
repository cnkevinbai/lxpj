# 高可用性配置指南

> 四川道达智能官网 + CRM 系统  
> 版本：v1.0.0  
> 更新日期：2026-03-11

---

## 📋 目录

1. [架构设计](#架构设计)
2. [服务高可用](#服务高可用)
3. [数据库高可用](#数据库高可用)
4. [缓存高可用](#缓存高可用)
5. [负载均衡](#负载均衡)
6. [监控告警](#监控告警)
7. [备份恢复](#备份恢复)
8. [故障处理](#故障处理)

---

## 架构设计

### 系统架构

```
                    ┌─────────────┐
                    │   Nginx     │
                    │  负载均衡   │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
    │ Website │      │ Backend │      │   CRM   │
    │  :3000  │      │  :3001  │      │  :3002  │
    └────┬────┘      └────┬────┘      └────┬────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
    │PostgreSQL│      │  Redis  │      │  MinIO  │
    │  :5432  │      │  :6379  │      │  :9000  │
    └─────────┘      └─────────┘      └─────────┘
```

### 高可用策略

| 层级 | 策略 | 说明 |
|-----|------|------|
| 应用层 | 多实例部署 | 支持水平扩展 |
| 数据层 | 主从复制 | 数据冗余备份 |
| 缓存层 | 集群模式 | 高可用缓存 |
| 网络层 | 负载均衡 | 流量分发 |

---

## 服务高可用

### Docker 服务配置

```yaml
version: '3.8'

services:
  backend:
    image: evcart-backend:latest
    deploy:
      replicas: 3  # 3 个实例
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 健康检查端点

```typescript
// GET /health
{
  "status": "ok",
  "timestamp": "2026-03-11T12:00:00.000Z",
  "services": {
    "database": "ok",
    "redis": "ok",
    "storage": "ok"
  }
}
```

---

## 数据库高可用

### PostgreSQL 主从配置

```yaml
# docker-compose.yml
services:
  postgres-master:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: evcart
      POSTGRES_USER: evcart
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_master_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  postgres-slave:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: evcart
      POSTGRES_USER: evcart
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_slave_data:/var/lib/postgresql/data
    depends_on:
      - postgres-master
```

### 备份策略

| 类型 | 频率 | 保留期 |
|-----|------|--------|
| 全量备份 | 每天 | 30 天 |
| 增量备份 | 每小时 | 7 天 |
| WAL 日志 | 实时 | 7 天 |

---

## 缓存高可用

### Redis 哨兵模式

```yaml
services:
  redis-master:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  redis-slave:
    image: redis:7-alpine
    command: redis-server --slaveof redis-master 6379
    depends_on:
      - redis-master

  redis-sentinel:
    image: redis:7-alpine
    command: redis-sentinel /usr/local/etc/redis/sentinel.conf
    depends_on:
      - redis-master
      - redis-slave
```

### 缓存策略

| 数据类型 | 过期时间 | 说明 |
|---------|---------|------|
| Session | 7 天 | 用户会话 |
| Token | 2 小时 | Access Token |
| 热点数据 | 1 小时 | 频繁访问数据 |
| 配置数据 | 永久 | 系统配置 |

---

## 负载均衡

### Nginx 配置

```nginx
upstream backend {
    least_conn;
    server backend-1:3001 weight=1 max_fails=3 fail_timeout=30s;
    server backend-2:3001 weight=1 max_fails=3 fail_timeout=30s;
    server backend-3:3001 weight=1 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name www.daoda-auto.com;

    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 负载均衡策略

| 策略 | 说明 | 适用场景 |
|-----|------|---------|
| 轮询 | 默认策略 | 服务器性能相近 |
| 最少连接 | 优先分发到连接数少的 | 长连接场景 |
| IP Hash | 同一 IP 固定服务器 | Session 保持 |
| 权重 | 按服务器性能分配 | 服务器性能不同 |

---

## 监控告警

### Prometheus 配置

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'backend'
    static_configs:
      - targets: ['backend-1:3001', 'backend-2:3001', 'backend-3:3001']
    metrics_path: '/metrics'
```

### 告警规则

```yaml
# alerting_rules.yml
groups:
  - name: evcart-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status="5xx"}[5m]) > 0.1
        for: 5m
        annotations:
          summary: "高错误率"
          description: "错误率超过 10%"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        annotations:
          summary: "高响应时间"
          description: "P95 响应时间超过 1 秒"
```

### 监控指标

| 指标 | 阈值 | 告警级别 |
|-----|------|---------|
| CPU 使用率 | >80% | 警告 |
| 内存使用率 | >80% | 警告 |
| 磁盘使用率 | >80% | 警告 |
| 错误率 | >1% | 严重 |
| 响应时间 | >1s | 警告 |

---

## 备份恢复

### 数据库备份脚本

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR

# 备份数据库
docker exec evcart-db pg_dump -U evcart evcart > $BACKUP_DIR/db_$DATE.sql

# 压缩备份
gzip $BACKUP_DIR/db_$DATE.sql

# 删除 7 天前的备份
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete

# 上传到对象存储 (可选)
# aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://evcart-backups/
```

### 恢复脚本

```bash
#!/bin/bash
# restore.sh

BACKUP_FILE=$1

# 解压备份
gunzip $BACKUP_FILE

# 恢复数据库
docker exec -i evcart-db psql -U evcart evcart < ${BACKUP_FILE%.gz}
```

### 备份计划

```bash
# crontab -e
# 每天凌晨 2 点备份
0 2 * * * /opt/backup.sh
```

---

## 故障处理

### 故障分级

| 级别 | 说明 | 响应时间 |
|-----|------|---------|
| P0 | 系统完全不可用 | 5 分钟 |
| P1 | 核心功能不可用 | 15 分钟 |
| P2 | 部分功能不可用 | 1 小时 |
| P3 | 非核心功能异常 | 4 小时 |

### 故障处理流程

```
1. 发现故障
   ↓
2. 确认故障级别
   ↓
3. 通知相关人员
   ↓
4. 故障隔离
   ↓
5. 故障修复
   ↓
6. 验证修复
   ↓
7. 故障复盘
```

### 应急预案

| 故障场景 | 应急预案 |
|---------|---------|
| 数据库故障 | 切换到从库 |
| 缓存故障 | 降级到数据库 |
| 服务故障 | 重启/切换实例 |
| 网络故障 | 切换备用线路 |

---

## 📞 应急联系

| 角色 | 联系方式 |
|-----|---------|
| 技术支持 | tech@daoda-auto.com |
| 紧急电话 | 400-XXX-XXXX |
| 值班人员 | oncall@daoda-auto.com |

---

_四川道达智能车辆制造有限公司 · 版权所有_
