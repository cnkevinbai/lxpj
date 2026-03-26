#!/bin/bash
#
# iov-platform 开发环境启动脚本
#
# Usage: ./deploy/scripts/start-dev.sh
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

echo "=========================================="
echo "  iov-platform 开发环境启动"
echo "=========================================="

# 检查 Java 版本
check_java() {
    if ! command -v java &> /dev/null; then
        echo "❌ Java 未安装"
        exit 1
    fi
    
    JAVA_VERSION=$(java -version 2>&1 | head -1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -lt 17 ]; then
        echo "❌ Java 版本需要 17 或更高"
        exit 1
    fi
    
    echo "✅ Java 版本: $(java -version 2>&1 | head -1)"
}

# 检查 Node 版本
check_node() {
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js 未安装"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo "❌ Node.js 版本需要 18 或更高"
        exit 1
    fi
    
    echo "✅ Node.js 版本: $(node -v)"
}

# 检查 Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo "⚠️  Docker 未安装，跳过容器服务"
        return
    fi
    
    if ! docker info &> /dev/null; then
        echo "⚠️  Docker 未运行，跳过容器服务"
        return
    fi
    
    echo "✅ Docker 已就绪"
    
    # 启动基础服务
    echo ""
    echo "启动基础服务..."
    cd "$PROJECT_ROOT"
    docker-compose up -d postgres redis kafka zookeeper 2>/dev/null || true
}

# 启动后端服务
start_backend() {
    echo ""
    echo "启动后端服务..."
    cd "$PROJECT_ROOT"
    
    # 构建
    if [ ! -f "target/*.jar" ]; then
        echo "构建后端..."
        mvn clean package -DskipTests -q
    fi
    
    # 启动 (后台)
    nohup java -jar target/*.jar > logs/backend.log 2>&1 &
    echo $! > /tmp/iov-backend.pid
    echo "✅ 后端服务已启动 (PID: $(cat /tmp/iov-backend.pid))"
}

# 启动前端服务
start_frontend() {
    echo ""
    echo "启动前端服务..."
    cd "$PROJECT_ROOT/web/iov-portal"
    
    # 安装依赖
    if [ ! -d "node_modules" ]; then
        echo "安装前端依赖..."
        npm ci --registry=https://registry.npmmirror.com
    fi
    
    # 启动开发服务器
    npm run dev &
    echo $! > /tmp/iov-frontend.pid
    echo "✅ 前端服务已启动 (PID: $(cat /tmp/iov-frontend.pid))"
}

# 主流程
main() {
    cd "$PROJECT_ROOT"
    
    # 创建日志目录
    mkdir -p logs
    
    # 检查环境
    echo "检查环境..."
    check_java
    check_node
    check_docker
    
    # 启动服务
    # start_backend
    # start_frontend
    
    echo ""
    echo "=========================================="
    echo "  环境检查完成！"
    echo ""
    echo "  启动后端: mvn spring-boot:run"
    echo "  启动前端: cd web/iov-portal && npm run dev"
    echo ""
    echo "  访问地址:"
    echo "    前端: http://localhost:5173"
    echo "    后端: http://localhost:8080"
    echo "=========================================="
}

main "$@"