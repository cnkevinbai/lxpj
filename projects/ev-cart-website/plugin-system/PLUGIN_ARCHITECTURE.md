# 模块化插件系统架构

> 设计日期：2026-03-12  
> 设计师：渔晓白 ⚙️

---

## 🏗️ 架构设计

### 核心概念

```
┌─────────────────────────────────────────────────────────┐
│                    应用核心 (Core)                       │
├─────────────────────────────────────────────────────────┤
│                   插件管理器 (Manager)                   │
├───────────┬───────────┬───────────┬─────────────────────┤
│  插件 A   │  插件 B   │  插件 C   │  插件 D ...         │
│ (热插拔)  │ (热插拔)  │ (热插拔)  │  (热插拔)           │
└───────────┴───────────┴───────────┴─────────────────────┘
```

---

## 📦 插件定义标准

### 插件结构

```
plugins/
└── plugin-name/
    ├── package.json          # 插件元信息
    ├── plugin.ts             # 插件入口
    ├── manifest.json         # 插件清单
    ├── components/           # 插件组件
    ├── services/             # 插件服务
    ├── hooks/                # 插件 Hooks
    └── assets/               # 静态资源
```

### 插件清单 (manifest.json)

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "displayName": "插件显示名称",
  "description": "插件功能描述",
  "author": "开发者",
  "main": "./plugin.ts",
  "dependencies": {
    "core": ">=1.0.0",
    "other-plugin": "^1.0.0"
  },
  "permissions": [
    "read:customer",
    "write:order",
    "delete:lead"
  ],
  "hooks": [
    "onAppInit",
    "onRouteChange",
    "onUserLogin"
  ],
  "menuItems": [
    {
      "parent": "sales",
      "label": "菜单项",
      "path": "/plugin-page",
      "icon": "HomeOutlined"
    }
  ],
  "routes": [
    {
      "path": "/plugin-page",
      "component": "./components/Page.tsx",
      "auth": true
    }
  ]
}
```

---

## 🔌 插件接口定义

### 插件基类

```typescript
// plugin-system/src/types/plugin.ts

export interface PluginManifest {
  name: string
  version: string
  displayName: string
  description: string
  author: string
  main: string
  dependencies?: Record<string, string>
  permissions?: string[]
  hooks?: string[]
  menuItems?: MenuItem[]
  routes?: RouteConfig[]
}

export interface PluginContext {
  app: any
  router: any
  store: any
  api: any
  config: any
}

export abstract class Plugin {
  manifest: PluginManifest
  context?: PluginContext

  constructor(manifest: PluginManifest) {
    this.manifest = manifest
  }

  // 生命周期钩子
  async onInstall?(ctx: PluginContext): Promise<void>
  async onEnable?(ctx: PluginContext): Promise<void>
  async onDisable?(ctx: PluginContext): Promise<void>
  async onUninstall?(ctx: PluginContext): Promise<void>
  
  // 应用生命周期
  async onAppInit?(ctx: PluginContext): Promise<void>
  async onRouteChange?(path: string, ctx: PluginContext): Promise<void>
  async onUserLogin?(user: any, ctx: PluginContext): Promise<void>
  async onUserLogout?(ctx: PluginContext): Promise<void>
}
```

---

## ⚙️ 插件管理器

### 核心功能

```typescript
// plugin-system/src/PluginManager.ts

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map()
  private pluginConfigs: Map<string, PluginConfig> = new Map()

  // 注册插件
  async register(pluginPath: string): Promise<void> {
    const manifest = await this.loadManifest(pluginPath)
    const PluginClass = await this.loadPlugin(pluginPath, manifest.main)
    const plugin = new PluginClass(manifest)
    
    this.plugins.set(manifest.name, plugin)
    await plugin.onInstall?.(this.context)
  }

  // 启用插件
  async enable(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) throw new Error(`Plugin ${pluginName} not found`)
    
    await plugin.onEnable?.(this.context)
    this.pluginConfigs.set(pluginName, { enabled: true })
  }

  // 禁用插件
  async disable(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) throw new Error(`Plugin ${pluginName} not found`)
    
    await plugin.onDisable?.(this.context)
    this.pluginConfigs.set(pluginName, { enabled: false })
  }

  // 卸载插件
  async unregister(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) throw new Error(`Plugin ${pluginName} not found`)
    
    await plugin.onUninstall?.(this.context)
    this.plugins.delete(pluginName)
    this.pluginConfigs.delete(pluginName)
  }

  // 获取插件
  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name)
  }

  // 获取所有插件
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  // 获取启用的插件
  getEnabledPlugins(): Plugin[] {
    return this.getAllPlugins().filter(p => 
      this.pluginConfigs.get(p.manifest.name)?.enabled
    )
  }
}
```

---

## 🔥 热插拔机制

### 动态加载

```typescript
// 使用 import() 动态加载插件
async function loadPlugin(pluginPath: string, mainFile: string) {
  const module = await import(`${pluginPath}/${mainFile}`)
  return module.default
}

// 热更新监听
function watchPluginChanges(pluginPath: string, callback: () => void) {
  const watcher = chokidar.watch(pluginPath, {
    ignored: /node_modules/,
    persistent: true
  })

  watcher.on('change', (path) => {
    console.log(`Plugin file changed: ${path}`)
    // 清除缓存
    delete require.cache[require.resolve(path)]
    callback()
  })
}
```

### 插件版本管理

```typescript
interface PluginVersion {
  name: string
  version: string
  installedAt: Date
  updatedAt: Date
  enabled: boolean
}

class PluginVersionManager {
  private versions: Map<string, PluginVersion> = new Map()

  async update(pluginName: string, newVersion: string): Promise<void> {
    const plugin = this.pluginManager.getPlugin(pluginName)
    if (!plugin) throw new Error('Plugin not found')

    // 备份旧版本
    await this.backup(pluginName)
    
    // 安装新版本
    await this.install(pluginName, newVersion)
    
    // 更新版本记录
    this.versions.set(pluginName, {
      name: pluginName,
      version: newVersion,
      installedAt: new Date(),
      updatedAt: new Date(),
      enabled: true
    })
  }

  async rollback(pluginName: string): Promise<void> {
    const backup = await this.getBackup(pluginName)
    if (!backup) throw new Error('No backup found')

    await this.install(pluginName, backup.version)
  }
}
```

---

## 📋 插件开发规范

### 快速开始

1. **创建插件目录**
```bash
mkdir -p plugins/my-plugin/{components,services,hooks,assets}
```

2. **创建 manifest.json**
```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "displayName": "我的插件",
  "main": "./plugin.ts"
}
```

3. **创建插件入口**
```typescript
import { Plugin } from '@evcart/plugin-system'

export default class MyPlugin extends Plugin {
  async onEnable(ctx: PluginContext) {
    console.log('MyPlugin enabled')
  }

  async onDisable(ctx: PluginContext) {
    console.log('MyPlugin disabled')
  }
}
```

4. **注册插件**
```typescript
pluginManager.register('./plugins/my-plugin')
```

---

## 🚀 快速编译标准

### 编译脚本

```bash
#!/bin/bash
# scripts/build-plugin.sh

PLUGIN_NAME=$1

if [ -z "$PLUGIN_NAME" ]; then
  echo "Usage: build-plugin.sh <plugin-name>"
  exit 1
fi

cd "plugins/$PLUGIN_NAME"

# 安装依赖
npm install

# 编译插件
npm run build

# 打包插件
npm pack

# 输出
echo "✅ Plugin $PLUGIN_NAME built successfully"
```

### 编译配置

```typescript
// plugins/plugin-name/vite.config.ts

import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'plugin.ts'),
      name: 'MyPlugin',
      fileName: 'index',
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['@evcart/plugin-system'],
    },
  },
})
```

### 增量编译

```typescript
// 使用 esbuild 实现快速增量编译
import { context } from 'esbuild'

const ctx = await context({
  entryPoints: ['plugin.ts'],
  bundle: true,
  outdir: 'dist',
  sourcemap: true,
})

await ctx.watch()
console.log('Watching for changes...')
```

---

## 📊 插件性能指标

| 指标 | 目标 | 说明 |
|-----|------|------|
| 加载时间 | < 500ms | 单个插件加载 |
| 启用时间 | < 200ms | 热插拔响应 |
| 内存占用 | < 50MB | 单个插件 |
| 编译时间 | < 5s | 完整编译 |
| 热更新 | < 1s | 增量更新 |

---

## ✅ 示例插件

### 数据导出插件

```typescript
// plugins/export-plugin/plugin.ts

import { Plugin } from '@evcart/plugin-system'

export default class ExportPlugin extends Plugin {
  async onEnable(ctx: PluginContext) {
    // 注册导出菜单
    ctx.app.registerMenuItem({
      parent: 'tools',
      label: '数据导出',
      path: '/export',
      icon: 'DownloadOutlined'
    })

    // 注册路由
    ctx.router.addRoute({
      path: '/export',
      component: () => import('./components/ExportPage')
    })
  }
}
```

### AI 助手插件

```typescript
// plugins/ai-assistant/plugin.ts

import { Plugin } from '@evcart/plugin-system'

export default class AIAssistantPlugin extends Plugin {
  async onEnable(ctx: PluginContext) {
    // 添加 AI 助手悬浮按钮
    ctx.app.addComponent('FloatingButton', {
      icon: 'RobotOutlined',
      onClick: () => ctx.app.openModal('ai-chat')
    })
  }
}
```

---

_渔晓白 ⚙️ · 专业架构_
