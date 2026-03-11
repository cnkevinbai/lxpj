#!/bin/bash
# Git 自动提交脚本 - 渔晓白
# 用法：./git-auto-commit.sh "提交信息"

cd /home/3844778_wy/.openclaw/workspace

# 检查是否有更改
if git diff --quiet && git diff --cached --quiet; then
    echo "✅ 无更改，跳过提交"
    exit 0
fi

# 添加所有更改
git add -A

# 获取更改统计
ADDED=$(git diff --cached --numstat | awk '{add+=$1} END {print add+0}')
DELETED=$(git diff --cached --numstat | awk '{del+=$2} END {print del+0}')
FILES=$(git diff --cached --name-only | wc -l | tr -d ' ')

# 生成提交信息
MESSAGE="${1:-自动提交 - $(date '+%Y-%m-%d %H:%M')}"
FULL_MESSAGE="$MESSAGE

📊 变更统计：
- 文件：$FILES
- 新增：+$ADDED
- 删除：-$DELETED

🦞 渔晓白 | OpenClaw"

# 提交
git commit -m "$FULL_MESSAGE"

echo "✅ 提交完成：$MESSAGE"
echo "   文件：$FILES | +$ADDED -$DELETED"
