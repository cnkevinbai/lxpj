#!/bin/bash
# OpenClaw 双 Gateway 启动脚本
# 主 Gateway: 端口 18789 (systemd 服务)
# 任务 Gateway: 端口 19001 (独立进程)

set -e

LOG_FILE="$HOME/.openclaw/gateway-task.log"
TASK_PORT=19001
MAIN_PORT=18789

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 检查端口是否被占用
check_port() {
    local port=$1
    if lsof -i:$port > /dev/null 2>&1; then
        return 0  # 端口被占用
    else
        return 1  # 端口空闲
    fi
}

# 获取占用端口的 PID
get_port_pid() {
    local port=$1
    lsof -t -i:$port 2>/dev/null | head -1
}

# 主逻辑
log "========================================="
log "OpenClaw 双 Gateway 启动脚本"
log "========================================="

# 1. 确保主 Gateway 运行 (端口 18789)
if check_port $MAIN_PORT; then
    log "✓ 主 Gateway 已运行 (端口 $MAIN_PORT)"
else
    log "! 主 Gateway 未运行，尝试启动..."
    if command -v systemctl &> /dev/null && systemctl is-active openclaw-gateway.service &> /dev/null; then
        log "  systemd 服务已激活，等待启动..."
        sleep 3
    else
        log "  启动主 Gateway..."
        systemctl --user start openclaw-gateway.service 2>/dev/null || \
            nohup openclaw gateway --port $MAIN_PORT > /tmp/openclaw-main.log 2>&1 &
        sleep 3
    fi

    if check_port $MAIN_PORT; then
        log "✓ 主 Gateway 启动成功"
    else
        log "✗ 主 Gateway 启动失败，请检查日志"
    fi
fi

# 2. 启动任务 Gateway (端口 19001)
if check_port $TASK_PORT; then
    EXISTING_PID=$(get_port_pid $TASK_PORT)
    log "! 端口 $TASK_PORT 已被占用 (PID: $EXISTING_PID)"

    # 检查是否是 openclaw-gateway 进程
    if ps -p $EXISTING_PID -o comm= 2>/dev/null | grep -q "openclaw"; then
        log "✓ 任务 Gateway 已运行 (PID: $EXISTING_PID)"
        log "  如需重启，请先: kill $EXISTING_PID"
    else
        log "! 端口被非 OpenClaw 进程占用，请手动处理"
        exit 1
    fi
else
    log "启动任务 Gateway (端口 $TASK_PORT)..."

    # 创建日志目录
    mkdir -p "$HOME/.openclaw"

    # 清除服务模式环境变量，启动独立 gateway
    (
        unset OPENCLAW_SERVICE_KIND OPENCLAW_SYSTEMD_UNIT OPENCLAW_GATEWAY_PORT OPENCLAW_SERVICE_MARKER OPENCLAW_SERVICE_VERSION
        cd "$HOME"
        nohup openclaw gateway --port $TASK_PORT --force >> "$LOG_FILE" 2>&1 &
        echo $! > "$HOME/.openclaw/gateway-task.pid"
    )

    # 等待启动
    sleep 4

    if check_port $TASK_PORT; then
        TASK_PID=$(get_port_pid $TASK_PORT)
        log "✓ 任务 Gateway 启动成功 (PID: $TASK_PID)"
    else
        log "✗ 任务 Gateway 启动失败，查看日志: $LOG_FILE"
        exit 1
    fi
fi

# 3. 输出访问地址
log "========================================="
log "访问地址:"
log "  主窗口:   http://127.0.0.1:$MAIN_PORT/__openclaw/control-ui/"
log "  任务窗口: http://127.0.0.1:$TASK_PORT/__openclaw/control-ui/"
log "========================================="

# 4. 显示状态
echo ""
echo "=== 进程状态 ==="
ps aux | grep "openclaw-gateway" | grep -v grep | awk '{print "  PID " $2 ": 端口 " ($NF ~ /18789/ ? "18789 (主)" : "19001 (任务)")}'

echo ""
echo "=== 端口监听 ==="
netstat -tlnp 2>/dev/null | grep -E "18789|19001" | awk '{print "  " $4 " -> " $7}'