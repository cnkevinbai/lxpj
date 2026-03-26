# OpenClaw 双门户导航设计文档

## 概述

OpenClaw 控制面板已实现双门户路由分离架构，为不同用户群体提供定制化的访问体验：

- **对外门户 (Portal)** - 面向普通用户/客户，提供服务访问界面
- **对内门户 (Admin)** - 面向系统操作员/管理员，提供完整的系统管理功能

## 路由架构

```
/ (根路由)
├── /portal (对外门户 - 用户服务门户)
│   ├── /portal/home - 服务首页
│   ├── /portal/services - 服务列表
│   ├── /portal/docs - 文档中心
│   ├── /portal/support - 支持中心
│   └── /portal/profile - 个人中心
│
└── /admin (对内门户 - 管理控制台)
    ├── /admin/dashboard - 仪表盘
    ├── /admin/chat - 实时对话
    ├── /admin/agents - 代理管理
    ├── /admin/skills - 技能管理
    ├── /admin/tasks - 任务中心
    ├── /admin/files - 文件管理
    ├── /admin/system - 系统运维
    └── /admin/settings - 系统设置
```

## 技术实现

### 技术栈

- **框架**: React 18 + Vite + TypeScript
- **UI 库**: Ant Design 5 + Tailwind CSS
- **路由**: React Router v6
- **状态管理**: Zustand (authStore)

### 布局组件

#### 1. PortalLayout (`src/layouts/PortalLayout.tsx`)

对外门户布局组件，特点：

- **风格**: 明亮/渐变风格，简洁、服务导向
- **导航**: 顶部水平导航栏
- **响应式**: 移动端自动切换为横向滚动导航
- **页脚**: 包含品牌信息、快速链接、联系方式

主要特性：
- 浅色渐变背景 (`from-slate-50 via-blue-50 to-indigo-100`)
- 白色半透明 Header，带毛玻璃效果
- 服务导向的导航设计
- 完整的页脚信息区
- 门户切换功能（管理员可切换到管理后台）

#### 2. AdminLayout (`src/layouts/AdminLayout.tsx`)

对内门户布局组件，特点：

- **风格**: 深色科技风格，专业、功能导向
- **导航**: 左侧垂直侧边栏 + 顶部 Header
- **响应式**: 移动端底部导航栏
- **功能**: 集成任务栏、任务监控、任务窗口容器

主要特性：
- 深色背景 (`#0a0a1a`) 配科技感光效
- 完整的侧边栏导航（8 个主要功能模块）
- 顶部 Header 包含搜索、通知、时间显示
- 任务管理系统集成
- 门户切换功能（可切换到服务门户）

### 路由保护

管理门户使用 `ProtectedRoute` 组件进行认证保护：

```tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuthStore();
  
  // 开发模式直接通过
  if (DEV_SKIP_LOGIN) {
    return <>{children}</>;
  }

  // Token 过期处理
  useEffect(() => {
    if (token && isTokenExpired(token)) {
      useAuthStore.getState().logout();
    }
  }, [token]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

### 门户切换

管理员可以在两个门户之间自由切换：

- **Portal → Admin**: 通过 Header 中的"管理后台"按钮
- **Admin → Portal**: 通过侧边栏的"服务门户"链接

## 设计风格对比

| 特性 | 对外门户 (Portal) | 对内门户 (Admin) |
|------|------------------|-----------------|
| **主色调** | 浅色渐变 (蓝/青) | 深色科技 (黑/青紫) |
| **背景** | `from-slate-50 via-blue-50 to-indigo-100` | `#0a0a1a` + 科技光效 |
| **导航位置** | 顶部水平导航 | 左侧垂直侧边栏 |
| **导航风格** | 简洁、服务导向 | 专业、功能完整 |
| **页脚** | 完整页脚（品牌、链接、联系） | 无页脚（全屏应用） |
| **目标用户** | 普通用户/客户 | 系统管理员/操作员 |
| **认证要求** | 部分页面需要 | 全部页面需要 |

## 文件结构

```
src/
├── layouts/
│   ├── PortalLayout.tsx      # 对外门户布局
│   ├── AdminLayout.tsx       # 对内门户布局
│   └── index.ts
├── pages/
│   ├── portal/               # 对外门户页面
│   │   ├── HomePage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── DocsPage.tsx
│   │   ├── SupportPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── index.ts
│   ├── DashboardPage.tsx
│   ├── ChatPage.tsx
│   ├── AgentsPage.tsx
│   ├── SkillsPage.tsx
│   ├── TasksPage.tsx
│   ├── FilesPage.tsx
│   ├── FileManagementPage.tsx
│   ├── SystemPage.tsx
│   ├── SettingsPage.tsx
│   ├── LoginPage.tsx
│   └── TaskWindowPage.tsx
├── components/
│   └── layout/
│       ├── Header.tsx        # 管理门户 Header
│       ├── Sidebar.tsx       # 管理门户侧边栏
│       ├── MobileNav.tsx     # 移动端导航（管理门户）
│       └── index.ts
└── App.tsx                   # 路由配置
```

## 页面说明

### 对外门户页面

#### HomePage (`/portal/home`)
- Hero 区域：欢迎语和 CTA 按钮
- 统计数据展示
- 服务卡片网格
- 功能特性展示
- CTA 行动号召

#### ServicesPage (`/portal/services`)
- 服务分类筛选
- 服务卡片网格（6 个服务）
- 每个服务包含：图标、标题、描述、特性标签、操作按钮
- 服务说明和帮助提示

#### DocsPage (`/portal/docs`)
- 搜索框
- 热门文档展示
- 文档分类（快速入门、用户指南、开发者文档、常见问题）
- 联系支持入口

#### SupportPage (`/portal/support`)
- 联系选项（邮件、电话、在线客服）
- 在线留言表单
- 常见问题 FAQ（可展开）

#### ProfilePage (`/portal/profile`)
- 用户信息卡片
- 侧边导航（账户信息、安全设置、通知设置）
- 退出登录功能

### 对内门户页面

管理门户复用现有页面，路由前缀从 `/` 改为 `/admin`：

- `/admin/dashboard` - 仪表盘
- `/admin/chat` - 实时对话
- `/admin/agents` - 代理管理
- `/admin/skills` - 技能管理
- `/admin/tasks` - 任务中心
- `/admin/files` - 文件管理
- `/admin/system` - 系统运维
- `/admin/settings` - 系统设置

## 响应式设计

### 桌面端 (≥768px)
- **Portal**: 顶部水平导航，完整页脚
- **Admin**: 左侧侧边栏 + 顶部 Header

### 移动端 (<768px)
- **Portal**: 横向滚动导航栏，简化页脚
- **Admin**: 底部导航栏（5 个核心功能）

## 权限控制

### 对外门户
- 大部分页面公开访问
- `/portal/profile` 需要登录

### 对内门户
- 所有页面需要认证
- 未认证用户重定向到 `/login`
- Token 过期自动登出

## 开发模式

开发模式下 (`DEV_SKIP_LOGIN = true`)：
- 跳过登录验证
- 直接访问管理门户
- 方便开发和测试

## 未来扩展

### 计划功能
1. **角色权限系统**: 细粒度的权限控制
2. **门户主题切换**: 支持亮色/暗色主题
3. **国际化**: 多语言支持
4. **个性化仪表板**: 用户自定义布局
5. **门户间数据同步**: 统一的用户状态管理

### 性能优化
1. **路由懒加载**: 按需加载页面组件
2. **组件缓存**: 使用 React.memo 优化渲染
3. **资源预加载**: 关键资源预加载策略

## 测试建议

### 功能测试
- [ ] 门户切换功能正常
- [ ] 路由保护生效
- [ ] 响应式布局正确
- [ ] 导航链接准确

### 视觉测试
- [ ] 双门户风格差异明显
- [ ] 颜色对比度符合可访问性标准
- [ ] 动画过渡流畅

### 兼容性测试
- [ ] 主流浏览器测试（Chrome、Firefox、Safari、Edge）
- [ ] 移动端设备测试（iOS、Android）
- [ ] 不同屏幕尺寸测试

## 总结

双门户导航设计成功实现了：
- ✅ 清晰的用户群体分离
- ✅ 差异化的视觉风格
- ✅ 完整的路由架构
- ✅ 响应式设计支持
- ✅ 权限控制机制
- ✅ 门户切换功能

该设计为 OpenClaw 平台提供了可扩展的基础架构，支持未来功能增长和用户体验优化。
