#!/bin/bash
# =====================
# 系统自检脚本
# =====================
# 用法：bash scripts/selfcheck.sh

set -e

echo "🔍 开始系统自检..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# 加载环境变量
if [ -f ".env" ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# 检查项计数
PASS=0
FAIL=0
WARN=0

# =====================
# 1. 系统环境检查
# =====================
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}1. 系统环境检查${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"

# Node.js 版本
echo -n "Node.js 版本... "
NODE_VERSION=$(node -v 2>/dev/null || echo "未安装")
if [[ $NODE_VERSION == v20* ]] || [[ $NODE_VERSION == v18* ]]; then
  echo -e "${GREEN}✓${NC} $NODE_VERSION"
  ((PASS++))
else
  echo -e "${RED}✗${NC} $NODE_VERSION (需要 v18 或 v20)"
  ((FAIL++))
fi

# npm 版本
echo -n "npm 版本... "
NPM_VERSION=$(npm -v 2>/dev/null || echo "未安装")
if [[ $NPM_VERSION != "未安装" ]]; then
  echo -e "${GREEN}✓${NC} $NPM_VERSION"
  ((PASS++))
else
  echo -e "${RED}✗${NC} npm 未安装"
  ((FAIL++))
fi

# Git
echo -n "Git... "
if command -v git &> /dev/null; then
  GIT_VERSION=$(git --version)
  echo -e "${GREEN}✓${NC} $GIT_VERSION"
  ((PASS++))
else
  echo -e "${YELLOW}⚠${NC} 未安装 (推荐安装)"
  ((WARN++))
fi

echo ""

# =====================
# 2. 项目文件检查
# =====================
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}2. 项目文件检查${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"

# .env 文件
echo -n ".env 文件... "
if [ -f ".env" ]; then
  echo -e "${GREEN}✓${NC} 存在"
  ((PASS++))
else
  echo -e "${YELLOW}⚠${NC} 不存在 (复制 .env.example)"
  ((WARN++))
fi

# 关键目录
echo -n "logs 目录... "
if [ -d "logs" ]; then
  echo -e "${GREEN}✓${NC} 存在"
  ((PASS++))
else
  mkdir -p logs
  echo -e "${GREEN}✓${NC} 已创建"
  ((PASS++))
fi

echo -n "uploads 目录... "
if [ -d "uploads" ]; then
  echo -e "${GREEN}✓${NC} 存在"
  ((PASS++))
else
  mkdir -p uploads
  echo -e "${GREEN}✓${NC} 已创建"
  ((PASS++))
fi

echo ""

# =====================
# 3. 依赖检查
# =====================
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}3. 依赖检查${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"

# Website
echo -n "website/node_modules... "
if [ -d "website/node_modules" ]; then
  echo -e "${GREEN}✓${NC} 已安装"
  ((PASS++))
else
  echo -e "${RED}✗${NC} 未安装 (运行 npm install)"
  ((FAIL++))
fi

# Backend
echo -n "backend/node_modules... "
if [ -d "backend/node_modules" ]; then
  echo -e "${GREEN}✓${NC} 已安装"
  ((PASS++))
else
  echo -e "${RED}✗${NC} 未安装 (运行 npm install)"
  ((FAIL++))
fi

# CRM
echo -n "crm/node_modules... "
if [ -d "crm/node_modules" ]; then
  echo -e "${GREEN}✓${NC} 已安装"
  ((PASS++))
else
  echo -e "${YELLOW}⚠${NC} 不存在 (可选)"
  ((WARN++))
fi

echo ""

# =====================
# 4. 数据库检查
# =====================
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}4. 数据库检查${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"

if command -v psql &> /dev/null && [ ! -z "$DB_HOST" ]; then
  echo -n "PostgreSQL 连接... "
  if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✓${NC} 连接成功"
    ((PASS++))
    
    # 检查必要表
    TABLES=("users" "customers" "products")
    for TABLE in "${TABLES[@]}"; do
      echo -n "  表 $TABLE... "
      if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1 FROM $TABLE LIMIT 1" &> /dev/null; then
        echo -e "${GREEN}✓${NC}"
        ((PASS++))
      else
        echo -e "${YELLOW}⚠${NC} 不存在"
        ((WARN++))
      fi
    done
  else
    echo -e "${RED}✗${NC} 连接失败"
    ((FAIL++))
  fi
else
  echo -e "${YELLOW}⚠${NC} 跳过 (未配置数据库)"
  ((WARN++))
fi

echo ""

# =====================
# 5. Redis 检查
# =====================
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}5. Redis 检查${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"

if command -v redis-cli &> /dev/null && [ ! -z "$REDIS_HOST" ]; then
  echo -n "Redis 连接... "
  if redis-cli -h $REDIS_HOST ping &> /dev/null; then
    echo -e "${GREEN}✓${NC} 连接成功"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} 连接失败"
    ((FAIL++))
  fi
else
  echo -e "${YELLOW}⚠${NC} 跳过 (未配置 Redis)"
  ((WARN++))
fi

echo ""

# =====================
# 6. 端口检查
# =====================
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}6. 端口检查${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"

PORTS=(3000 3001 3002)
NAMES=("website" "backend" "crm")

for i in "${!PORTS[@]}"; do
  PORT=${PORTS[$i]}
  NAME=${NAMES[$i]}
  echo -n "端口 $PORT ($NAME)... "
  if command -v lsof &> /dev/null; then
    if lsof -Pi :$PORT -sTCP:LISTEN -t &> /dev/null; then
      echo -e "${YELLOW}⚠${NC} 已被占用"
      ((WARN++))
    else
      echo -e "${GREEN}✓${NC} 可用"
      ((PASS++))
    fi
  else
    echo -e "${YELLOW}⚠${NC} 跳过 (lsof 未安装)"
    ((WARN++))
  fi
done

echo ""

# =====================
# 7. 磁盘空间检查
# =====================
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}7. 磁盘空间检查${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"

echo -n "磁盘使用率... "
DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 80 ]; then
  echo -e "${GREEN}✓${NC} ${DISK_USAGE}%"
  ((PASS++))
elif [ $DISK_USAGE -lt 90 ]; then
  echo -e "${YELLOW}⚠${NC} ${DISK_USAGE}% (建议清理)"
  ((WARN++))
else
  echo -e "${RED}✗${NC} ${DISK_USAGE}% (空间不足)"
  ((FAIL++))
fi

echo ""

# =====================
# 8. Git 状态检查
# =====================
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}8. Git 状态检查${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"

if command -v git &> /dev/null && [ -d ".git" ]; then
  echo -n "工作区状态... "
  if git diff --quiet; then
    echo -e "${GREEN}✓${NC} 干净"
    ((PASS++))
  else
    echo -e "${YELLOW}⚠${NC} 有未提交更改"
    ((WARN++))
  fi
  
  echo -n "分支... "
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  echo -e "${GREEN}✓${NC} $BRANCH"
  ((PASS++))
else
  echo -e "${YELLOW}⚠${NC} 跳过 (非 Git 仓库)"
  ((WARN++))
fi

echo ""

# =====================
# 汇总
# =====================
echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}自检汇总${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"
echo ""
echo -e "  ${GREEN}通过${NC}: $PASS"
echo -e "  ${RED}失败${NC}: $FAIL"
echo -e "  ${YELLOW}警告${NC}: $WARN"
echo ""

if [ $FAIL -gt 0 ]; then
  echo -e "${RED}╔════════════════════════════════════╗${NC}"
  echo -e "${RED}║  ✗ 自检失败，请修复上述问题      ║${NC}"
  echo -e "${RED}╚════════════════════════════════════╝${NC}"
  exit 1
elif [ $WARN -gt 5 ]; then
  echo -e "${YELLOW}╔════════════════════════════════════╗${NC}"
  echo -e "${YELLOW}║  ⚠ 警告较多，建议检查            ║${NC}"
  echo -e "${YELLOW}╚════════════════════════════════════╝${NC}"
  exit 0
else
  echo -e "${GREEN}╔════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  ✓ 自检通过，可以启动            ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════╝${NC}"
  exit 0
fi
