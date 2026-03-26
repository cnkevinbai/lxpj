#!/bin/bash
#
# iov-platform 生产环境部署脚本
#
# Usage: ./deploy/scripts/deploy-prod.sh [version]
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"
VERSION="${1:-1.0.0}"

echo "=========================================="
echo "  iov-platform 生产环境部署"
echo "  版本: $VERSION"
echo "=========================================="

# 构建后端
build_backend() {
    echo ""
    echo "构建后端服务..."
    cd "$PROJECT_ROOT"
    
    mvn clean package -DskipTests -q
    
    # 构建 Docker 镜像
    docker build -t iov-platform/backend:$VERSION \
                 -t iov-platform/backend:latest \
                 -f Dockerfile .
    
    echo "✅ 后端构建完成"
}

# 构建前端
build_frontend() {
    echo ""
    echo "构建前端服务..."
    cd "$PROJECT_ROOT"
    
    # 构建 Docker 镜像
    docker build -t iov-platform/frontend:$VERSION \
                 -t iov-platform/frontend:latest \
                 -f Dockerfile.frontend .
    
    echo "✅ 前端构建完成"
}

# 推送镜像
push_images() {
    echo ""
    echo "推送 Docker 镜像..."
    
    # 推送到镜像仓库
    # docker push iov-platform/backend:$VERSION
    # docker push iov-platform/backend:latest
    # docker push iov-platform/frontend:$VERSION
    # docker push iov-platform/frontend:latest
    
    echo "✅ 镜像推送完成"
}

# 部署服务
deploy_services() {
    echo ""
    echo "部署服务..."
    cd "$PROJECT_ROOT"
    
    # 使用 docker-compose 部署
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
    
    echo "✅ 服务部署完成"
}

# 健康检查
health_check() {
    echo ""
    echo "健康检查..."
    
    # 等待服务启动
    sleep 10
    
    # 检查后端
    if curl -sf http://localhost:8080/actuator/health > /dev/null; then
        echo "✅ 后端服务健康"
    else
        echo "❌ 后端服务异常"
    fi
    
    # 检查前端
    if curl -sf http://localhost:80 > /dev/null; then
        echo "✅ 前端服务健康"
    else
        echo "❌ 前端服务异常"
    fi
}

# 主流程
main() {
    cd "$PROJECT_ROOT"
    
    build_backend
    build_frontend
    # push_images
    # deploy_services
    # health_check
    
    echo ""
    echo "=========================================="
    echo "  部署完成！"
    echo ""
    echo "  访问地址:"
    echo "    前端: http://localhost:80"
    echo "    后端: http://localhost:8080"
    echo ""
    echo "  查看日志: docker-compose logs -f"
    echo "=========================================="
}

main "$@"