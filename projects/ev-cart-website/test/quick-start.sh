#!/bin/bash
# 快速启动测试环境

echo "🚀 快速启动测试环境..."

# 检查后端
cd /home/3844778_wy/.openclaw/workspace/projects/ev-cart-website/backend
if [ ! -f "dist/main.js" ]; then
    echo "📦 编译后端..."
    npm run build > /tmp/backend-build.log 2>&1
fi

# 启动后端
echo "🚀 启动后端..."
npm run start:prod > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

# 等待后端
echo "⏳ 等待后端启动 (30 秒)..."
for i in {1..30}; do
    if curl -s http://localhost:3001/api > /dev/null 2>&1; then
        echo "✅ 后端启动成功"
        break
    fi
    sleep 1
done

# 启动前端
cd /home/3844778_wy/.openclaw/workspace/projects/ev-cart-website/portal
echo "🚀 启动前端..."
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

# 等待前端
echo "⏳ 等待前端启动 (15 秒)..."
for i in {1..15}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo "✅ 前端启动成功"
        break
    fi
    sleep 1
done

echo ""
echo "=== 服务状态 ==="
echo "后端：http://localhost:3001/api"
echo "前端：http://localhost:5173"
echo ""
echo "=== 运行测试 ==="
cd /home/3844778_wy/.openclaw/workspace/projects/ev-cart-website/test
echo "完整测试：npm run test:all"
