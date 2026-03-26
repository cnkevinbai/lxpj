#!/bin/bash
# 快速启动测试环境脚本

echo "🚀 启动测试环境..."

# 启动后端
echo "📦 启动后端服务..."
cd /home/3844778_wy/.openclaw/workspace/projects/ev-cart-website/backend
npm run start:dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "后端 PID: $BACKEND_PID"

# 等待后端启动
echo "⏳ 等待后端启动 (15 秒)..."
sleep 15

# 检查后端
if curl -s http://localhost:3001/api > /dev/null 2>&1; then
    echo "✅ 后端启动成功"
else
    echo "⚠️ 后端启动中..."
fi

# 启动前端
echo "📦 启动前端服务..."
cd /home/3844778_wy/.openclaw/workspace/projects/ev-cart-website/portal
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "前端 PID: $FRONTEND_PID"

# 等待前端启动
echo "⏳ 等待前端启动 (10 秒)..."
sleep 10

# 检查前端
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ 前端启动成功"
else
    echo "⚠️ 前端启动中..."
fi

echo ""
echo "=== 服务状态 ==="
echo "后端：http://localhost:3001/api"
echo "前端：http://localhost:5173"
echo ""
echo "=== 运行测试 ==="
echo "快速验证：npm run test:p0"
echo "完整测试：npm run test:all"
echo ""
echo "进程 ID:"
echo "后端：$BACKEND_PID"
echo "前端：$FRONTEND_PID"
