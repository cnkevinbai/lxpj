#!/bin/bash
# OpenClaw 控制面板 - 管理脚本

case "$1" in
    start)
        echo "🚀 启动 OpenClaw 控制面板..."
        docker-compose up -d
        ;;
    stop)
        echo "🛑 停止 OpenClaw 控制面板..."
        docker-compose down
        ;;
    restart)
        echo "🔄 重启 OpenClaw 控制面板..."
        docker-compose restart
        ;;
    logs)
        docker-compose logs -f ${2:-}
        ;;
    status)
        echo "📊 服务状态:"
        docker-compose ps
        echo ""
        echo "🏥 健康检查:"
        curl -s http://localhost:3001/api/system/health | python3 -m json.tool 2>/dev/null || echo "后端不可达"
        ;;
    build)
        echo "📦 构建 Docker 镜像..."
        docker-compose build --no-cache
        ;;
    clean)
        echo "🧹 清理所有数据..."
        read -p "确认删除所有数据？(y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v --remove-orphans
            echo "✅ 已清理"
        fi
        ;;
    backup)
        echo "💾 备份数据库..."
        docker-compose exec postgres pg_dump -U openclaw openclaw_dashboard > backup_$(date +%Y%m%d_%H%M%S).sql
        echo "✅ 备份完成"
        ;;
    *)
        echo "OpenClaw 控制面板管理脚本"
        echo ""
        echo "用法: $0 {start|stop|restart|logs|status|build|clean|backup}"
        echo ""
        echo "命令说明:"
        echo "  start   - 启动服务"
        echo "  stop    - 停止服务"
        echo "  restart - 重启服务"
        echo "  logs    - 查看日志 (可选: logs backend/frontend)"
        echo "  status  - 查看状态"
        echo "  build   - 重新构建镜像"
        echo "  clean   - 清理所有数据"
        echo "  backup  - 备份数据库"
        exit 1
        ;;
esac