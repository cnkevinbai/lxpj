#!/bin/bash
# deploy.sh - 道达智能系统一键部署脚本

set -e

echo "=========================================="
echo "  道达智能系统 - 一键部署脚本"
echo "  版本：3.0.0"
echo "  时间：$(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查环境
echo "📋 检查环境..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker 未安装${NC}"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose 未安装${NC}"
    echo "请先安装 Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker 和 Docker Compose 已安装${NC}"
echo ""

# 检查配置文件
echo "⚙️  检查配置文件..."
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env 文件不存在，从模板创建...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  请修改 .env 文件配置后重新运行${NC}"
    echo ""
    echo "配置项说明:"
    echo "  DB_PASSWORD - 数据库密码"
    echo "  REDIS_PASSWORD - Redis 密码"
    echo "  JWT_SECRET - JWT 密钥"
    echo ""
    exit 0
fi

echo -e "${GREEN}✅ 配置文件已存在${NC}"
echo ""

# 加载环境变量
echo "📥 加载环境变量..."
source .env
echo -e "${GREEN}✅ 环境变量已加载${NC}"
echo ""

# 构建镜像
echo "🔨 构建 Docker 镜像..."
docker-compose build
echo -e "${GREEN}✅ 镜像构建完成${NC}"
echo ""

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d
echo -e "${GREEN}✅ 服务已启动${NC}"
echo ""

# 健康检查
echo "🏥 健康检查..."
sleep 15

echo ""
echo "检查数据库..."
if docker-compose ps postgres | grep -q "Up"; then
    echo -e "${GREEN}✅ 数据库运行正常${NC}"
else
    echo -e "${RED}❌ 数据库启动失败${NC}"
fi

echo "检查 Redis..."
if docker-compose ps redis | grep -q "Up"; then
    echo -e "${GREEN}✅ Redis 运行正常${NC}"
else
    echo -e "${RED}❌ Redis 启动失败${NC}"
fi

echo "检查后端 API..."
if docker-compose ps api | grep -q "Up"; then
    echo -e "${GREEN}✅ 后端 API 运行正常${NC}"
else
    echo -e "${RED}❌ 后端 API 启动失败${NC}"
fi

echo "检查前端..."
if docker-compose ps frontend | grep -q "Up"; then
    echo -e "${GREEN}✅ 前端运行正常${NC}"
else
    echo -e "${RED}❌ 前端启动失败${NC}"
fi

echo "检查 Nginx..."
if docker-compose ps nginx | grep -q "Up"; then
    echo -e "${GREEN}✅ Nginx 运行正常${NC}"
else
    echo -e "${RED}❌ Nginx 启动失败${NC}"
fi

echo ""

# 显示访问信息
echo "=========================================="
echo -e "${GREEN}✅ 部署完成！${NC}"
echo "=========================================="
echo ""
echo "📱 访问地址："
echo "   官网：http://localhost"
echo "   门户：http://localhost/portal"
echo "   API:   http://localhost/api"
echo ""
echo "🔧 常用命令："
echo "   查看日志：docker-compose logs -f"
echo "   停止服务：docker-compose down"
echo "   重启服务：docker-compose restart"
echo "   查看状态：docker-compose ps"
echo ""
echo "📝 日志位置："
echo "   Nginx 日志：./nginx/logs/"
echo "   应用日志：docker-compose logs -f [service]"
echo ""
echo "=========================================="
