# ====================
# iov-platform 后端服务 Dockerfile
# ====================

FROM eclipse-temurin:17-jre-alpine

LABEL maintainer="渔晓白 <dev@daod.com>"
LABEL version="1.0.0"
LABEL description="道达智能车辆管理平台后端服务"

# 设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 创建应用目录
WORKDIR /app

# 创建非 root 用户
RUN addgroup -S iov && adduser -S iov -G iov

# 复制构建产物
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# 设置权限
RUN chown -R iov:iov /app

# 切换用户
USER iov

# 暴露端口
EXPOSE 8080

# JVM 参数
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"

# 启动命令
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]