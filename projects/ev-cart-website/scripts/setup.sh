#!/bin/bash
# =====================
# 项目初始化脚本
# =====================
# 用法：bash scripts/setup.sh

set -e

echo "🚀 开始项目初始化..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# =====================
# 1. 检查环境
# =====================
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}1. 检查环境${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"

# Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js 未安装${NC}"
  exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓${NC} Node.js: ${NODE_VERSION}"

# npm
if ! command -v npm &> /dev/null; then
  echo -e "${RED}✗ npm 未安装${NC}"
  exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓${NC} npm: ${NPM_VERSION}"

# Git
if ! command -v git &> /dev/null; then
  echo -e "${YELLOW}⚠ Git 未安装 (推荐安装)${NC}"
fi

echo ""

# =====================
# 2. 创建目录结构
# =====================
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}2. 创建目录结构${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"

mkdir -p logs/{website,backend,crm}
mkdir -p uploads/{images,files,avatars}
mkdir -p database/migrations
echo -e "${GREEN}✓${NC} 目录创建完成"
echo ""

# =====================
# 3. 创建环境变量文件
# =====================
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}3. 创建环境变量${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"

if [ -f ".env" ]; then
  echo -e "${YELLOW}⚠ .env 文件已存在，跳过${NC}"
else
  cp .env.example .env
  echo -e "${GREEN}✓${NC} .env 文件已创建"
  echo -e "${YELLOW}  请编辑 .env 文件配置数据库等信息${NC}"
fi
echo ""

# =====================
# 4. 安装依赖
# =====================
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}4. 安装依赖${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"

# Website (Next.js)
if [ -d "website" ]; then
  echo "安装 website 依赖..."
  cd website
  npm install
  cd ..
  echo -e "${GREEN}✓${NC} website 依赖安装完成"
else
  echo -e "${YELLOW}⚠ website 目录不存在，跳过${NC}"
fi

# Backend (NestJS)
if [ -d "backend" ]; then
  echo "安装 backend 依赖..."
  cd backend
  npm install
  cd ..
  echo -e "${GREEN}✓${NC} backend 依赖安装完成"
else
  echo -e "${YELLOW}⚠ backend 目录不存在，跳过${NC}"
fi

# CRM (React)
if [ -d "crm" ]; then
  echo "安装 crm 依赖..."
  cd crm
  npm install
  cd ..
  echo -e "${GREEN}✓${NC} crm 依赖安装完成"
else
  echo -e "${YELLOW}⚠ crm 目录不存在，跳过${NC}"
fi

echo ""

# =====================
# 5. 初始化数据库
# =====================
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}5. 初始化数据库${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"

if command -v psql &> /dev/null; then
  read -p "是否初始化数据库？(y/n): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    # 从 .env 读取配置
    source .env
    
    # 创建数据库
    psql -h $DB_HOST -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || true
    echo -e "${GREEN}✓${NC} 数据库创建完成"
    
    # 导入表结构
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f database/schema.sql
    echo -e "${GREEN}✓${NC} 表结构导入完成"
    
    # 导入初始数据
    if [ -f "database/seed.sql" ]; then
      psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f database/seed.sql
      echo -e "${GREEN}✓${NC} 初始数据导入完成"
    fi
  fi
else
  echo -e "${YELLOW}⚠ psql 未安装，跳过数据库初始化${NC}"
fi
echo ""

# =====================
# 6. 运行自检
# =====================
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}6. 运行自检${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"

if [ -f "scripts/selfcheck.sh" ]; then
  bash scripts/selfcheck.sh
else
  echo -e "${YELLOW}⚠ 自检脚本不存在，跳过${NC}"
fi
echo ""

# =====================
# 完成
# =====================
echo -e "${GREEN}════════════════════════════════════${NC}"
echo -e "${GREEN}✓ 项目初始化完成！${NC}"
echo -e "${GREEN}════════════════════════════════════${NC}"
echo ""
echo "下一步:"
echo "  1. 编辑 .env 文件配置数据库等信息"
echo "  2. 运行：bash scripts/selfcheck.sh"
echo "  3. 启动开发服务器:"
echo "     cd website && npm run dev"
echo "     cd backend && npm run start:dev"
echo ""
