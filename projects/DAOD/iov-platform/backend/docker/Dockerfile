# 后端 Dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

# 安装必要工具
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 复制构建产物 (假设已构建)
# COPY target/*.jar app.jar

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/health/live || exit 1

# 启动命令 (模拟启动)
CMD ["sh", "-c", "echo 'Backend service running on port 8080' && tail -f /dev/null"]