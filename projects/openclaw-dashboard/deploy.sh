#!/bin/bash
# OpenClaw 控制面板 - 一键部署脚本

set -e

echo "🚀 OpenClaw 控制面板部署脚本"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker 未安装${NC}"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}错误: Docker Compose 未安装${NC}"
    echo "请先安装 Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✓ Docker 已安装${NC}"
echo -e "${GREEN}✓ Docker Compose 已安装${NC}"

# 检查 .env.production
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}创建 .env.production 文件...${NC}"
    cp .env.production.example .env.production 2>/dev/null || echo "请手动创建 .env.production"
fi

# 加载环境变量
set -a
source .env.production 2>/dev/null || true
set +a

# 构建镜像
echo ""
echo -e "${YELLOW}📦 构建 Docker 镜像...${NC}"
docker-compose build --no-cache

# 停止旧容器
echo ""
echo -e "${YELLOW}🛑 停止旧容器...${NC}"
docker-compose down --remove-orphans 2>/dev/null || true

# 启动服务
echo ""
echo -e "${YELLOW}🚀 启动服务...${NC}"
docker-compose up -d

# 等待服务启动
echo ""
echo -e "${YELLOW}⏳ 等待服务启动...${NC}"
sleep 10

# 检查服务状态
echo ""
echo -e "${YELLOW}📊 服务状态:${NC}"
docker-compose ps

# 健康检查
echo ""
echo -e "${YELLOW}🏥 健康检查...${NC}"

# 检查后端
BACKEND_HEALTH=$(curl -s http://localhost:3001/api/system/health 2>/dev/null || echo "failed")
if echo "$BACKEND_HEALTH" | grep -q "healthy"; then
    echo -e "${GREEN}✓ 后端服务正常${NC}"
else
    echo -e "${RED}✗ 后端服务异常${NC}"
fi

# 检查前端
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null || echo "000")
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ 前端服务正常${NC}"
else
    echo -e "${RED}✗ 前端服务异常 (HTTP $FRONTEND_STATUS)${NC}"
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo "访问地址:"
echo "  前端: http://localhost:3000"
echo "  后端: http://localhost:3001/api"
echo ""
echo "管理命令:"
echo "  查看日志: docker-compose logs -f"
echo "  停止服务: docker-compose down"
echo "  重启服务: docker-compose restart"
echo ""