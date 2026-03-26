#!/bin/bash
# OpenClaw 多 Profile 启动脚本
# 用途：启动独立的 task profile Gateway

echo "🦞 启动 OpenClaw Task Profile..."
echo ""

# 检查端口是否被占用
if lsof -i:19001 > /dev/null 2>&1; then
    echo "⚠️  端口 19001 已被占用"
    echo "   检查是否有其他 task gateway 在运行"
    lsof -i:19001
    echo ""
    read -p "是否强制重启？(y/N): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        echo "   正在停止旧进程..."
        kill $(lsof -t -i:19001) 2>/dev/null
        sleep 2
    else
        echo "   取消启动"
        exit 1
    fi
fi

# 启动 task gateway (后台运行)
echo "🚀 启动中..."
nohup openclaw --profile task gateway > ~/.openclaw-task/gateway.log 2>&1 &
PID=$!

echo ""
echo "✅ Task Gateway 已启动"
echo "   PID: $PID"
echo "   端口: 19001"
echo "   日志: ~/.openclaw-task/gateway.log"
echo ""
echo "📡 访问地址:"
echo "   WebSocket: ws://127.0.0.1:19001"
echo "   Control UI: http://127.0.0.1:19001/__openclaw/control-ui/"
echo ""
echo "💡 提示:"
echo "   - 主窗口 (默认): http://127.0.0.1:18789/__openclaw/control-ui/"
echo "   - 任务窗口 (task): http://127.0.0.1:19001/__openclaw/control-ui/"