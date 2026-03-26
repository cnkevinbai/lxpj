#!/bin/bash

# 快速启动脚本 (仅启动数据库和基础服务)

set -e

echo "🚀 启动基础服务..."

# 仅启动数据库和 Redis
docker-compose up -d postgres redis

echo "⏳ 等待数据库就绪..."
sleep 5

# 检查数据库
docker-compose exec -T postgres pg_isready -U iov

echo ""
echo "✅ 基础服务已启动"
echo ""
echo "数据库连接信息:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: iov_platform"
echo "  User: iov"
echo "  Password: iov123456"
echo ""
echo "Redis 连接信息:"
echo "  Host: localhost"
echo "  Port: 6379"
echo ""