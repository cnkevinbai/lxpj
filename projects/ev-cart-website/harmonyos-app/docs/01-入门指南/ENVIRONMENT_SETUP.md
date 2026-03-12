# 环境搭建

> 更新时间：2026-03-12  
> 预计时间：30 分钟

---

## 🛠️ 环境要求

### 系统要求

| 系统 | 版本 | 说明 |
|-----|------|------|
| **Windows** | 10/11 | 64 位 |
| **macOS** | 10.15+ | Intel/Apple Silicon |
| **Linux** | Ubuntu 20.04+ | 64 位 |

### 软件要求

| 软件 | 版本 | 用途 |
|-----|------|------|
| **DevEco Studio** | 4.0+ | 开发工具 |
| **Node.js** | 16.0+ | 运行时环境 |
| **ohpm** | 1.0+ | 包管理工具 |
| **HarmonyOS SDK** | API 11+ | 开发 SDK |

---

## 📥 安装步骤

### 步骤 1: 安装 DevEco Studio

**下载地址**: https://developer.harmonyos.com/cn/develop/deveco-studio

**安装步骤**:
1. 下载对应系统的安装包
2. 运行安装程序
3. 选择安装路径
4. 完成安装

**配置**:
```
SDK 路径：默认 (或自定义)
JDK: 使用内置 JDK
```

### 步骤 2: 安装 Node.js

**下载地址**: https://nodejs.org/

**安装步骤**:
1. 下载 LTS 版本 (16.x)
2. 运行安装程序
3. 完成安装

**验证安装**:
```bash
node -v  # 应显示 v16.x.x
npm -v   # 应显示 8.x.x
```

### 步骤 3: 安装 ohpm

ohpm 随 DevEco Studio 一起安装，无需单独安装。

**验证安装**:
```bash
ohpm -v  # 应显示 1.x.x
```

### 步骤 4: 配置 SDK

1. 打开 DevEco Studio
2. File → Settings → SDK Manager
3. 确保 HarmonyOS SDK API 11+ 已安装
4. 如未安装，点击 Install

---

## ⚙️ 项目配置

### 步骤 1: 克隆项目

```bash
git clone <repository-url>
cd harmonyos-app
```

### 步骤 2: 安装依赖

```bash
ohpm install
```

### 步骤 3: 配置环境变量

```bash
# 复制环境配置
cp .env.example .env

# 编辑配置
vim .env
```

**配置说明**:
```bash
# API 接口地址
API_BASE_URL=https://api.example.com

# 应用配置
APP_ID=com.daoda.crm
APP_VERSION=1.0.0

# 调试配置
DEBUG=true
LOG_LEVEL=debug
```

### 步骤 4: 配置签名

1. 打开 DevEco Studio
2. File → Project Structure → Signing Configs
3. 配置签名证书
4. 保存配置

---

## 🧪 验证安装

### 创建模拟器

1. Tools → Device Manager
2. 点击 Local Emulator
3. 选择 Phone 设备
4. 选择 API 11+ 系统镜像
5. 点击 Create

### 运行项目

1. 选择刚创建的模拟器
2. 点击运行按钮 (绿色三角形)
3. 等待项目构建和部署
4. 查看应用运行情况

### 预期结果

- 项目构建成功
- 应用成功部署到模拟器
- 显示道达智能 APP 首页

---

## ❓ 常见问题

### Q: ohpm install 失败？

**A**: 检查网络连接，或使用国内镜像：
```bash
ohpm config set registry https://registry.npmmirror.com
```

### Q: 模拟器启动失败？

**A**: 
1. 检查 VT 虚拟化是否开启
2. 确保磁盘空间充足
3. 重启 DevEco Studio

### Q: 构建失败？

**A**:
1. 清理项目：Build → Clean Project
2. 重新构建：Build → Rebuild Project
3. 检查 SDK 版本是否正确

---

## 📚 相关文档

- [快速开始](./QUICK_START.md)
- [项目结构](./PROJECT_STRUCTURE.md)
- [开发指南](../04-开发指南/DEVELOPMENT_GUIDE.md)

---

_道达智能 · 版权所有_
