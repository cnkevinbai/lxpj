@echo off
setlocal enabledelayedexpansion

REM 车联网平台模块化框架构建和测试脚本 (Windows)

echo === 车联网平台模块化框架构建和测试 ===

REM 检查Maven是否安装
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: Maven未安装，请先安装Maven
    exit /b 1
)

REM 检查Java是否安装
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: Java未安装，请先安装Java 17+
    exit /b 1
)

echo Java版本:
java -version
echo.

echo Maven版本:
mvn -version
echo.

REM 切换到项目根目录
cd /d "%~dp0..\.."

echo 当前目录: %cd%
echo.

REM 清理之前的构建
echo 清理之前的构建...
mvn clean

REM 编译项目
echo 编译项目...
mvn compile
if %errorlevel% neq 0 (
    echo 编译失败
    exit /b 1
)

REM 运行单元测试
echo 运行单元测试...
mvn test
if %errorlevel% neq 0 (
    echo 单元测试失败
    exit /b 1
)

REM 打包项目
echo 打包项目...
mvn package -DskipTests
if %errorlevel% neq 0 (
    echo 打包失败
    exit /b 1
)

echo 构建和测试完成！
echo.

REM 运行演示程序
echo 运行模块化框架演示...
mvn exec:java -Dexec.mainClass="com.daod.iov.plugin.DemoApplication" -pl core/plugin-framework
if %errorlevel% neq 0 (
    echo 演示程序运行失败
    exit /b 1
)

echo 演示程序运行完成！