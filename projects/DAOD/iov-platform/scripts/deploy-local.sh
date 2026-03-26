#!/bin/bash

# 本地部署脚本

set -e

echo "=========================================="
echo "  iov-platform 本地部署"
echo "=========================================="
echo ""

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ 需要安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ 需要安装 Docker Compose"
    exit 1
fi

echo "✅ Docker 环境检查通过"
echo ""

# 创建环境文件
if [ ! -f .env ]; then
    echo "📝 创建环境文件..."
    cp .env .env
fi

# 停止旧容器
echo "🛑 停止旧容器..."
docker-compose down 2>/dev/null || true

# 构建镜像
echo ""
echo "🔨 构建 Docker 镜像..."
docker-compose build

# 启动服务
echo ""
echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
echo ""
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo ""
echo "📊 服务状态:"
docker-compose ps

echo ""
echo "=========================================="
echo "  部署完成!"
echo "=========================================="
echo ""
echo "访问地址:"
echo "  前端:     http://localhost:3000"
echo "  API:      http://localhost:8080"
echo "  数据库:   localhost:5432"
echo "  Redis:    localhost:6379"
echo "  EMQX:     localhost:1883"
echo "  EMQX管理: http://localhost:18083"
echo ""
echo "默认账号:"
echo "  邮箱: admin@daod.com"
echo "  密码: admin123"
echo ""
echo "常用命令:"
echo "  查看日志: docker-compose logs -f"
echo "  停止服务: docker-compose down"
echo "  重启服务: docker-compose restart"
echo ""