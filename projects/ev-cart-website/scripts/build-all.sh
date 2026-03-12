#!/bin/bash

# ====================
# 全项目快速编译脚本
# 渔晓白 ⚙️ · 专业交付
# ====================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "======================================"
echo "  道达智能 - 全项目编译"
echo "======================================"
echo ""

START_TIME=$(date +%s)

# 1. 编译后端
print_info "编译后端服务..."
if [ -d "backend" ]; then
    cd backend
    npm install --silent
    npm run build
    cd ..
    print_success "后端编译完成"
else
    print_error "后端目录不存在"
fi

# 2. 编译 CRM
print_info "编译 CRM 系统..."
if [ -d "crm" ]; then
    cd crm
    npm install --silent
    npm run build
    cd ..
    print_success "CRM 编译完成"
else
    print_error "CRM 目录不存在"
fi

# 3. 编译 ERP 前端
print_info "编译 ERP 前端..."
if [ -d "erp-frontend" ]; then
    cd erp-frontend
    npm install --silent
    npm run build
    cd ..
    print_success "ERP 前端编译完成"
else
    print_error "ERP 前端目录不存在"
fi

# 4. 编译官网
print_info "编译官网..."
if [ -d "website" ]; then
    cd website
    npm install --silent
    npm run build
    cd ..
    print_success "官网编译完成"
else
    print_error "官网目录不存在"
fi

# 5. 编译插件
print_info "编译插件..."
if [ -d "plugins" ]; then
    for plugin_dir in plugins/*/; do
        if [ -f "$plugin_dir/package.json" ]; then
            plugin_name=$(basename "$plugin_dir")
            print_info "编译插件：$plugin_name"
            cd "$plugin_dir"
            npm install --silent
            npm run build
            cd ../..
        fi
    done
    print_success "插件编译完成"
fi

END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))

echo ""
echo "======================================"
echo -e "${GREEN}✅ 全项目编译完成${NC}"
echo "======================================"
echo "总耗时：${TOTAL_TIME}s"
echo ""
