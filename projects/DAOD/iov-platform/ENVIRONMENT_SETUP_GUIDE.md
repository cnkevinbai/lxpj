# 车联网管理平台开发环境安装指南

## 环境要求

- JDK 17+
- Maven 3.8+
- Docker & Docker Compose
- Git

## Windows系统安装指南

### 1. 安装JDK 17+

#### 方法一：使用Oracle JDK
1. 访问 Oracle JDK 下载页面：https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
2. 下载适合您系统的JDK 17版本
3. 运行安装程序并按照提示完成安装
4. 设置环境变量：
   - JAVA_HOME: 指向JDK安装目录
   - PATH: 添加 `%JAVA_HOME%\bin`

#### 方法二：使用OpenJDK（推荐）
1. 访问 OpenJDK 下载页面或使用包管理器
2. 使用Chocolatey安装（如果已安装）：
   ```
   choco install openjdk17
   ```

### 2. 安装Maven 3.8+

#### 方法一：手动安装
1. 访问 Maven 官网：https://maven.apache.org/download.cgi
2. 下载 Binary zip archive (apache-maven-3.8.x-bin.zip)
3. 解压到指定目录（如 C:\apache-maven-3.8.x）
4. 设置环境变量：
   - M2_HOME: 指向Maven解压目录
   - PATH: 添加 `%M2_HOME%\bin`

#### 方法二：使用包管理器
1. 使用Chocolatey安装：
   ```
   choco install maven
   ```

### 3. 安装Docker Desktop

1. 访问 Docker Desktop 下载页面：https://www.docker.com/products/docker-desktop/
2. 下载并安装 Docker Desktop for Windows
3. 启动 Docker Desktop 应用程序
4. 确保启用 WSL 2 或 Hyper-V 功能

### 4. 验证安装

打开命令提示符，依次运行以下命令验证安装：

```bash
# 验证Java
java -version

# 验证Maven
mvn -version

# 验证Docker
docker --version
docker-compose --version
```

## Linux/macOS系统安装指南

### Ubuntu/Debian系统

```bash
# 安装Java 17
sudo apt update
sudo apt install openjdk-17-jdk

# 安装Maven
sudo apt install maven

# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### CentOS/RHEL系统

```bash
# 安装Java 17
sudo yum install java-17-openjdk-devel

# 安装Maven
sudo yum install maven

# 安装Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo usermod -aG docker $USER
```

### macOS系统

```bash
# 使用Homebrew安装（需要先安装Homebrew）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装Java 17
brew install openjdk@17

# 安装Maven
brew install maven

# 安装Docker Desktop for Mac
# 从官网下载并安装：https://www.docker.com/products/docker-desktop/
```

## 环境配置验证

安装完成后，在终端或命令提示符中运行以下命令验证环境：

```bash
# 检查Java版本
java -version

# 检查Maven版本
mvn -version

# 检查Docker版本
docker --version

# 检查Docker Compose版本
docker-compose --version

# 测试Docker是否正常工作
docker run hello-world
```

## 启动开发环境

安装完成后，您可以使用以下命令启动开发环境：

```bash
# 进入项目目录
cd iov-platform

# 启动依赖服务
cd deploy/docker
docker-compose -f docker-compose-dev.yml up -d

# 构建项目
cd ../..
mvn clean install

# 启动演示应用
java -cp "core/plugin-framework/target/classes;core/plugin-framework/target/dependency/*" com.daod.iov.plugin.DemoApplication
```

## 常见问题解决

### 1. Docker权限问题（Linux）
如果遇到Docker权限问题，请将用户添加到docker组：
```bash
sudo usermod -aG docker $USER
# 然后重新登录或重启系统
```

### 2. Maven镜像配置
为了提高下载速度，可以配置阿里云Maven镜像，在 ~/.m2/settings.xml 中添加：

```xml
<settings>
  <mirrors>
    <mirror>
      <id>aliyunmaven</id>
      <mirrorOf>*</mirrorOf>
      <name>阿里云公共仓库</name>
      <url>https://maven.aliyun.com/repository/public</url>
    </mirror>
  </mirrors>
</settings>
```

### 3. 端口冲突
如果启动Docker服务时出现端口冲突，请检查是否有其他服务占用了相关端口：
- PostgreSQL: 5432
- TimescaleDB: 5433
- ClickHouse: 8123, 9000
- Redis: 6379
- EMQX: 1883, 8083, 8084, 8883, 18083
- Kafka: 9092
- MinIO: 9000, 9001
- Prometheus: 9090
- Grafana: 3000

## 故障排除

如果在安装过程中遇到问题，请检查：

1. 系统是否满足最低硬件要求
2. 是否有足够的磁盘空间
3. 防火墙或杀毒软件是否阻止了安装
4. 网络连接是否稳定
5. 是否以管理员权限运行安装程序

## 后续步骤

环境安装完成后，您可以：

1. 运行 `mvn clean install` 构建项目
2. 启动Docker服务：`docker-compose -f deploy/docker/docker-compose-dev.yml up -d`
3. 运行模块化框架演示：`java -cp "core/plugin-framework/target/classes" com.daod.iov.plugin.DemoApplication`
4. 开始开发新的业务模块