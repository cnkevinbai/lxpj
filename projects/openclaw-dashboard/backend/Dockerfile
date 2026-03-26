# 后端 Dockerfile - NestJS 生产镜像
FROM node:20-alpine AS builder

WORKDIR /app

# 安装依赖
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# 生成 Prisma Client
RUN npx prisma generate

# 复制源码并构建
COPY . .
RUN npm run build

# 生产镜像
FROM node:20-alpine AS runner

WORKDIR /app

# 安装生产依赖
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production && \
    npx prisma generate

# 复制构建产物
COPY --from=builder /app/dist ./dist

# 环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["node", "dist/main.js"]