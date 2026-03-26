#!/bin/bash

# 车联网平台模块化框架构建和测试脚本

echo "=== 车联网平台模块化框架构建和测试 ==="

# 检查Maven是否安装
if ! command -v mvn &> /dev/null; then
    echo "错误: Maven未安装，请先安装Maven"
    exit 1
fi

# 检查Java是否安装
if ! command -v java &> /dev/null; then
    echo "错误: Java未安装，请先安装Java 17+"
    exit 1
fi

echo "Java版本:"
java -version

echo "Maven版本:"
mvn -version

# 返回项目根目录
cd "$(dirname "$0")/../.."

echo "当前目录: $(pwd)"

# 清理之前的构建
echo "清理之前的构建..."
mvn clean

# 编译项目
echo "编译项目..."
if ! mvn compile; then
    echo "编译失败"
    exit 1
fi

# 运行单元测试
echo "运行单元测试..."
if ! mvn test; then
    echo "单元测试失败"
    exit 1
fi

# 打包项目
echo "打包项目..."
if ! mvn package -DskipTests; then
    echo "打包失败"
    exit 1
fi

echo "构建和测试完成！"

# 运行演示程序
echo "运行模块化框架演示..."
if ! mvn exec:java -Dexec.mainClass="com.daod.iov.plugin.DemoApplication" -pl core/plugin-framework; then
    echo "演示程序运行失败"
    exit 1
fi

echo "演示程序运行完成！"