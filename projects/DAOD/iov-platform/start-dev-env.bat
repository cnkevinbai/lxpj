@echo off
setlocal

echo ===============================================
echo    车联网管理平台开发环境启动脚本
echo ===============================================

echo.
echo 正在检查环境...
echo.

:: 检查Java
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到Java，请确保已安装JDK 17+
    pause
    exit /b 1
)

:: 检查Maven
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到Maven，请确保已安装Maven 3.8+
    pause
    exit /b 1
)

:: 检查Docker
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo 警告: 未找到Docker，部分功能可能无法使用
)

echo 环境检查完成
echo.

:: 启动依赖服务
echo 正在启动开发环境依赖服务...
cd deploy/docker
docker-compose -f docker-compose-dev.yml up -d
if %errorlevel% neq 0 (
    echo 警告: 启动Docker服务失败，可能未安装Docker
) else (
    echo Docker服务启动成功
    timeout /t 10 /nobreak >nul
)
cd ../..

echo.
echo 正在构建项目...
echo.

:: 构建项目
mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo 构建失败
    pause
    exit /b 1
)

echo.
echo 项目构建成功
echo.

:: 启动演示应用
echo 正在启动演示应用...
java -cp "core/plugin-framework/target/classes;core/plugin-framework/target/dependency/*" com.daod.iov.plugin.DemoApplication

echo.
echo ===============================================
echo    开发环境启动完成
echo    按任意键退出并停止服务
echo ===============================================

pause

:: 停止依赖服务
echo.
echo 正在停止开发环境依赖服务...
cd deploy/docker
docker-compose -f docker-compose-dev.yml down
cd ../..