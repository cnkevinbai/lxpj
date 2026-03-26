# Docker 容器技能

## 📋 技能说明

使用 Docker 进行应用容器化和部署。

---

## 🎯 适用场景

- 容器化部署
- 环境标准化
- 微服务部署

---

## 📝 Dockerfile 模板

```dockerfile
# Node.js 应用
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

---

## 📝 Docker Compose 模板

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/app
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine

volumes:
  pgdata:
```

---

## ✅ 检查清单

- [ ] 镜像最小化
- [ ] 多阶段构建
- [ ] 环境变量配置
- [ ] 健康检查

---

## 📚 相关技能

- `cicd` - CI/CD 流水线