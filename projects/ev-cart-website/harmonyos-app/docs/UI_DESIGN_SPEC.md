# 道达智能鸿蒙应用 UI 设计规范

> 版本：v1.0.0  
> 更新日期：2026-03-12  
> 设计：渔晓白 ⚙️

---

## 📋 目录

1. [设计原则](#设计原则)
2. [色彩规范](#色彩规范)
3. [字体规范](#字体规范)
4. [图标规范](#图标规范)
5. [布局规范](#布局规范)
6. [组件规范](#组件规范)
7. [页面设计](#页面设计)
8. [交互规范](#交互规范)

---

## 设计原则

### 1. 简洁高效

- 一屏一任务
- 三步内完成操作
- 信息层次清晰

### 2. 统一一致

- 统一的视觉语言
- 统一的交互模式
- 统一的反馈机制

### 3. 以用户为中心

- 符合用户心智模型
- 符合鸿蒙设计规范
- 无障碍设计

### 4. 性能优先

- 快速加载
- 流畅动画
- 即时反馈

---

## 色彩规范

### 品牌色

| 名称 | 色值 | 用途 |
|-----|------|------|
| **主色** | `#007DFF` | 主要按钮、选中状态、链接 |
| **主色浅** | `#3695FF` | 主色渐变、悬停状态 |
| **主色深** | `#0068D6` | 主色按下状态 |

### 功能色

| 名称 | 色值 | 用途 |
|-----|------|------|
| **成功** | `#52C41A` | 成功状态、完成标识 |
| **警告** | `#FAAD14` | 警告提示、注意标识 |
| **错误** | `#FF4D4F` | 错误提示、删除操作 |
| **信息** | `#1890FF` | 信息提示、链接 |

### 中性色

| 名称 | 色值 | 用途 |
|-----|------|------|
| **标题文字** | `#1D1D1F` | 主标题、重要文字 |
| **正文文字** | `#333333` | 正文内容 |
| **次要文字** | `#666666` | 辅助信息、说明文字 |
| **占位文字** | `#999999` | 输入框占位符 |
| **边框颜色** | `#E5E5E5` | 分割线、边框 |
| **背景色** | `#F5F5F5` | 页面背景 |
| **卡片背景** | `#FFFFFF` | 卡片、列表项背景 |

### 渐变配置

```typescript
// 主色渐变
linearGradient({
  angle: 135,
  colors: ['#007DFF', '#3695FF']
})

// 背景渐变
linearGradient({
  angle: 180,
  colors: ['#F5F7FA', '#E8ECF1']
})
```

---

## 字体规范

### 字体家族

```typescript
// 鸿蒙系统字体
fontFamily: 'HarmonyOS Sans'

// 备用字体
fontFamily: 'sans-serif'
```

### 字号规范

| 级别 | 字号 | 行高 | 字重 | 用途 |
|-----|------|------|------|------|
| **超大标题** | 32sp | 44sp | Bold | 页面大标题 |
| **大标题** | 24sp | 32sp | Bold | 模块标题 |
| **中标题** | 20sp | 28sp | Medium | 卡片标题 |
| **小标题** | 18sp | 26sp | Medium | 列表标题 |
| **正文大** | 16sp | 24sp | Regular | 主要正文 |
| **正文** | 14sp | 22sp | Regular | 普通正文 |
| **正文小** | 12sp | 20sp | Regular | 辅助文字 |
| **提示文字** | 10sp | 18sp | Regular | 说明提示 |

### 字重规范

| 字重 | 值 | 用途 |
|-----|-----|------|
| **Bold** | 700 | 标题、重要信息 |
| **Medium** | 500 | 小标题、按钮文字 |
| **Regular** | 400 | 正文、普通文字 |

### 文字颜色

```typescript
// 主要文字
fontSize: 16
fontColor: '#1D1D1F'

// 次要文字
fontSize: 14
fontColor: '#666666'

// 占位文字
fontSize: 14
fontColor: '#999999'
```

---

## 图标规范

### 图标尺寸

| 类型 | 尺寸 | 用途 |
|-----|------|------|
| **应用图标** | 108x108dp | 桌面图标 |
| **导航图标** | 24x24dp | 底部导航 |
| **功能图标** | 20x20dp | 功能按钮 |
| **列表图标** | 16x16dp | 列表项 |

### 图标风格

- 线性图标 (描边 2dp)
- 面性图标 (填充)
- 圆角设计 (圆角 2dp)

### 图标颜色

```typescript
// 默认状态
fillColor: '#666666'

// 选中状态
fillColor: '#007DFF'

// 禁用状态
fillColor: '#CCCCCC'
```

### 常用图标

| 图标 | 名称 | 用途 |
|-----|------|------|
| 🏠 | Home | 首页 |
| 👥 | Customer | 客户 |
| 📋 | Approval | 审批 |
| 💬 | Message | 消息 |
| 👤 | User | 我的 |
| 🔍 | Search | 搜索 |
| ➕ | Add | 添加 |
| ⚙️ | Settings | 设置 |

---

## 布局规范

### 栅格系统

```typescript
// 列间距
columnGap: 16

// 行间距
rowGap: 16

// 页面边距
padding: 16
```

### 间距规范

| 级别 | 间距 | 用途 |
|-----|------|------|
| **超大间距** | 32 | 模块间距 |
| **大间距** | 24 | 大模块内间距 |
| **中间距** | 16 | 标准间距 |
| **小间距** | 12 | 小组件间距 |
| **超小间距** | 8 | 紧密元素间距 |

### 安全区域

```typescript
// 顶部安全区 (避开状态栏)
safeArea: { top: true }

// 底部安全区 (避开导航栏)
safeArea: { bottom: true }
```

### 屏幕适配

| 屏幕尺寸 | 布局策略 |
|---------|---------|
| **手机** | 单列布局 |
| **折叠屏** | 双列布局 |
| **平板** | 多列布局 |

---

## 组件规范

### 按钮

#### 主要按钮

```typescript
Button('提交')
  .width('100%')
  .height(48)
  .backgroundColor('#007DFF')
  .borderRadius(24)
  .fontSize(16)
  .fontColor('#FFFFFF')
  .fontWeight(FontWeight.Medium)
```

#### 次要按钮

```typescript
Button('取消')
  .width('100%')
  .height(48)
  .backgroundColor('#FFFFFF')
  .borderColor('#007DFF')
  .borderWidth(1)
  .borderRadius(24)
  .fontSize(16)
  .fontColor('#007DFF')
  .fontWeight(FontWeight.Medium)
```

#### 图标按钮

```typescript
Button() {
  Image($r('app.media.icon_add'))
    .width(20)
    .height(20)
}
.width(40)
.height(40)
.borderRadius(20)
.backgroundColor('#007DFF')
```

### 输入框

```typescript
TextInput({ placeholder: '请输入...' })
  .width('100%')
  .height(48)
  .padding({ left: 16, right: 16 })
  .backgroundColor('#F5F5F5')
  .borderRadius(8)
  .fontSize(16)
  .fontColor('#333333')
  .placeholderColor('#999999')
```

### 卡片

```typescript
Column() {
  // 卡片内容
}
.width('100%')
.padding(16)
.backgroundColor('#FFFFFF')
.borderRadius(12)
.shadow({
  radius: 8,
  color: 'rgba(0, 0, 0, 0.05)',
  offsetX: 0,
  offsetY: 2
})
```

### 列表项

```typescript
Row() {
  // 列表项内容
}
.width('100%')
.height(72)
.padding({ left: 16, right: 16 })
.backgroundColor('#FFFFFF')
.borderBottomWidth(1)
.borderBottomColor('#E5E5E5')
```

### 标签

```typescript
// 成功标签
Text('已完成')
  .fontSize(12)
  .fontColor('#52C41A')
  .padding({ left: 8, right: 8, top: 4, bottom: 4 })
  .backgroundColor('rgba(82, 196, 26, 0.1)')
  .borderRadius(4)

// 警告标签
Text('待处理')
  .fontSize(12)
  .fontColor('#FAAD14')
  .padding({ left: 8, right: 8, top: 4, bottom: 4 })
  .backgroundColor('rgba(250, 173, 20, 0.1)')
  .borderRadius(4)
```

### 徽章

```typescript
Badge({ count: 5 }) {
  Image($r('app.media.icon_message'))
    .width(24)
    .height(24)
}
.badgeColor('#FF4D4F')
.badgePosition(BadgePosition.TOP_RIGHT)
```

---

## 页面设计

### 首页

```
┌─────────────────────────────────┐
│  搜索框                          │
│  🔍 搜索客户/订单/审批...         │
├─────────────────────────────────┤
│  快捷操作 (4 列)                  │
│  📋    👥    💰    📊           │
│  审批    客户    订单    报表    │
├─────────────────────────────────┤
│  待办事项                        │
│  ┌─────────────────────────┐   │
│  │ 待审批 (5)               │   │
│  │ 待跟进 (12)              │   │
│  │ 待处理 (8)               │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│  数据概览                        │
│  ┌─────────┐  ┌─────────┐     │
│  │ 今日收款 │  │ 今日付款 │     │
│  │ ¥125,000│  │ ¥67,000 │     │
│  └─────────┘  └─────────┘     │
└─────────────────────────────────┘
│  首页  │  CRM  │  ERP  │  我的  │
└─────────────────────────────────┘
```

### 客户列表页

```
┌─────────────────────────────────┐
│  ← 客户列表        ➕            │
├─────────────────────────────────┤
│  🔍 搜索客户                      │
├─────────────────────────────────┤
│  筛选：全部 ▼  等级 ▼  地区 ▼    │
├─────────────────────────────────┤
│  ┌─────────────────────────┐   │
│  │ 某某科技有限公司         │   │
│  │ 联系人：张总 138****    │   │
│  │ A 类客户  │  已成交      │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 某某制造厂               │   │
│  │ 联系人：李经理 139****  │   │
│  │ B 类客户  │  跟进中      │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

### 审批详情页

```
┌─────────────────────────────────┐
│  ← 审批详情                      │
├─────────────────────────────────┤
│  采购审批                        │
│  PO20260312001                   │
│  [待审批]                        │
├─────────────────────────────────┤
│  基本信息                        │
│  供应商：四川钢铁集团            │
│  金额：¥125,000                  │
│  申请人：张三                    │
│  申请时间：2026-03-12 10:30     │
├─────────────────────────────────┤
│  产品明细                        │
│  - 钢材 A 型 x 100  ¥50,000     │
│  - 钢材 B 型 x 50   ¥75,000     │
├─────────────────────────────────┤
│  审批流程                        │
│  ● 部门经理 → ● 财务 → ○ 总监  │
├─────────────────────────────────┤
│  [拒绝]              [通过]      │
└─────────────────────────────────┘
```

---

## 交互规范

### 页面切换动画

```typescript
// 从右向左推入
router.pushUrl({
  url: '/pages/Detail',
  animation: {
    duration: 300,
    curve: Curve.EaseInOut
  }
})

// 从左向右弹出
router.back({
  animation: {
    duration: 300,
    curve: Curve.EaseInOut
  }
})
```

### 加载状态

```typescript
// 刷新加载
Refresh() {
  // 内容
}
.onRefreshing(() => {
  // 刷新逻辑
})
.progressColor('#007DFF')
```

### 空状态

```typescript
Column() {
  Image($r('app.media.empty_data'))
    .width(200)
    .height(200)
  Text('暂无数据')
    .fontSize(16)
    .fontColor('#999999')
    .margin({ top: 16 })
}
.width('100%')
.height('100%')
.justifyContent(FlexAlign.Center)
.alignItems(VerticalAlign.Center)
```

### 错误提示

```typescript
// Toast 提示
Toast.show({
  message: '操作成功',
  duration: 2000
})

// 对话框提示
AlertDialog.show({
  title: '提示',
  message: '确定要删除吗？',
  confirm: {
    color: '#FF4D4F',
    action: () => {
      // 确认操作
    }
  },
  cancel: {
    action: () => {
      // 取消操作
    }
  }
})
```

---

## 暗黑模式

### 色彩适配

```typescript
// 暗黑模式背景
backgroundColor: {
  light: '#F5F5F5',
  dark: '#1A1A1A'
}

// 暗黑模式卡片
backgroundColor: {
  light: '#FFFFFF',
  dark: '#2D2D2D'
}

// 暗黑模式文字
fontColor: {
  light: '#1D1D1F',
  dark: '#FFFFFF'
}
```

---

_道达智能 · 版权所有_
