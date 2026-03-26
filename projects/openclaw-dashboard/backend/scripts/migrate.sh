#!/bin/bash
# 数据库迁移脚本 - 生产环境

set -e

echo "🔄 数据库迁移脚本"
echo "=================="

# 检查环境变量
if [ -z "$DATABASE_URL" ]; then
    echo "错误: DATABASE_URL 未设置"
    exit 1
fi

# 生成 Prisma Client
echo "📦 生成 Prisma Client..."
npx prisma generate

# 运行迁移
echo "🗄️ 运行数据库迁移..."
npx prisma migrate deploy

echo ""
echo "✅ 数据库迁移完成！"