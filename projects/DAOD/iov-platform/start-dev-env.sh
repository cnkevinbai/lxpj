#!/bin/bash

# 车联网管理平台开发环境启动脚本

set -e

echo "==============================================="
echo "    车联网管理平台开发环境启动脚本"
echo "==============================================="

echo
echo "正在检查环境..."
echo

# 检查Java
if ! command -v java &> /dev/null; then
    echo "错误: 未找到Java，请确保已安装JDK 17+"
    exit 1
fi

# 检查Maven
if ! command -v mvn &> /dev/null; then
    echo "错误: 未找到Maven，请确保已安装Maven 3.8+"
    exit 1
fi

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo "警告: 未找到Docker，部分功能可能无法使用"
fi

echo "环境检查完成"
echo

# 启动依赖服务
echo "正在启动开发环境依赖服务..."
cd deploy/docker
docker-compose -f docker-compose-dev.yml up -d || echo "警告: 启动Docker服务失败，可能未安装Docker"
cd ../..

echo
echo "正在构建项目..."
echo

# 构建项目
mvn clean install -DskipTests
if [ $? -ne 0 ]; then
    echo "构建失败"
    exit 1
fi

echo
echo "项目构建成功"
echo

# 启动演示应用
echo "正在启动演示应用..."
java -cp "core/plugin-framework/target/classes:$(find core/plugin-framework/target/dependency -name '*.jar' | tr '\n' ':')" com.daod.iov.plugin.DemoApplication

echo
echo "==============================================="
echo "    开发环境启动完成"
echo "    按Ctrl+C退出并停止服务"
echo "==============================================="

# 捕获中断信号并停止服务
trap 'echo; echo "正在停止开发环境依赖服务..."; cd deploy/docker && docker-compose -f docker-compose-dev.yml down; cd ../..; exit 0' INT TERM

# 等待用户中断
while true; do
    sleep 1
done