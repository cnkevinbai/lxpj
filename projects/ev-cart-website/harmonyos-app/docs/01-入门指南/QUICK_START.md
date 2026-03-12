# 快速开始

> 更新时间：2026-03-12  
> 预计时间：5 分钟

---

## 🚀 5 分钟快速上手

### 前置要求

- DevEco Studio 4.0+
- Node.js 16.0+
- HarmonyOS SDK API 11+

### 步骤 1: 克隆项目

```bash
git clone <repository-url>
cd harmonyos-app
```

### 步骤 2: 安装依赖

```bash
ohpm install
```

### 步骤 3: 配置环境

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
```

### 步骤 4: 运行项目

```bash
# 连接模拟器或真机
# 点击 DevEco Studio 运行按钮

# 或使用命令行
ohpm run
```

### 步骤 5: 查看效果

运行成功后，您将看到道达智能 APP 的首页界面。

---

## 📁 项目结构

```
entry/
├── src/main/ets/
│   ├── pages/          # 页面
│   ├── components/     # 组件
│   ├── services/       # API 服务
│   ├── store/          # 状态管理
│   └── utils/          # 工具函数
├── src/main/resources/ # 资源文件
└── ohosTest/           # 测试代码
```

---

## 🎯 下一步

- [环境搭建](./ENVIRONMENT_SETUP.md) - 详细环境配置
- [项目结构](./PROJECT_STRUCTURE.md) - 目录结构说明
- [开发指南](../04-开发指南/DEVELOPMENT_GUIDE.md) - 开发规范

---

_道达智能 · 版权所有_
