#!/bin/bash

# ====================
# 插件快速编译脚本
# 渔晓白 ⚙️ · 专业交付
# ====================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印函数
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 使用帮助
show_help() {
    echo "用法：build-plugin.sh [选项] <插件名称>"
    echo ""
    echo "选项:"
    echo "  -w, --watch       监听模式（增量编译）"
    echo "  -p, --production  生产环境编译"
    echo "  -c, --clean       清理构建缓存"
    echo "  -t, --test        运行测试"
    echo "  -h, --help        显示帮助信息"
    echo ""
    echo "示例:"
    echo "  ./build-plugin.sh my-plugin"
    echo "  ./build-plugin.sh -w my-plugin"
    echo "  ./build-plugin.sh -p my-plugin"
    echo "  ./build-plugin.sh --clean --production my-plugin"
}

# 解析参数
WATCH=false
PRODUCTION=false
CLEAN=false
TEST=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -w|--watch)
            WATCH=true
            shift
            ;;
        -p|--production)
            PRODUCTION=true
            shift
            ;;
        -c|--clean)
            CLEAN=true
            shift
            ;;
        -t|--test)
            TEST=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            PLUGIN_NAME=$1
            shift
            ;;
    esac
done

# 检查插件名称
if [ -z "$PLUGIN_NAME" ]; then
    print_error "请指定插件名称"
    show_help
    exit 1
fi

# 设置路径
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PLUGIN_DIR="$PROJECT_ROOT/plugins/$PLUGIN_NAME"

# 检查插件目录
if [ ! -d "$PLUGIN_DIR" ]; then
    print_error "插件目录不存在：$PLUGIN_DIR"
    exit 1
fi

cd "$PLUGIN_DIR"

# 检查 package.json
if [ ! -f "package.json" ]; then
    print_error "插件缺少 package.json 文件"
    exit 1
fi

print_info "开始编译插件：$PLUGIN_NAME"
print_info "插件目录：$PLUGIN_DIR"

# 清理构建
if [ "$CLEAN" = true ]; then
    print_info "清理构建缓存..."
    rm -rf node_modules dist .turbo
    print_success "清理完成"
fi

# 安装依赖
print_info "安装依赖..."
if [ -f "package-lock.json" ]; then
    npm ci --silent
else
    npm install --silent
fi
print_success "依赖安装完成"

# 运行测试
if [ "$TEST" = true ]; then
    print_info "运行测试..."
    if npm run test --silent; then
        print_success "测试通过"
    else
        print_error "测试失败"
        exit 1
    fi
fi

# 编译插件
print_info "编译插件..."
START_TIME=$(date +%s)

if [ "$WATCH" = true ]; then
    print_info "监听模式启动..."
    npm run build:watch &
    WATCH_PID=$!
    
    # 监听文件变化
    print_success "监听中... (按 Ctrl+C 停止)"
    wait $WATCH_PID
else
    # 普通编译
    if [ "$PRODUCTION" = true ]; then
        export NODE_ENV=production
        print_info "生产环境编译..."
    fi
    
    if npm run build; then
        END_TIME=$(date +%s)
        BUILD_TIME=$((END_TIME - START_TIME))
        print_success "编译完成 (耗时：${BUILD_TIME}s)"
    else
        print_error "编译失败"
        exit 1
    fi
fi

# 验证构建
if [ -d "dist" ] && [ -f "dist/index.js" ]; then
    print_success "插件构建验证通过"
    
    # 显示构建信息
    if [ -f "dist/index.js" ]; then
        FILE_SIZE=$(du -h "dist/index.js" | cut -f1)
        print_info "输出文件：dist/index.js ($FILE_SIZE)"
    fi
else
    print_warning "构建输出目录不存在，请检查构建配置"
fi

print_success "✅ 插件 $PLUGIN_NAME 编译完成"
