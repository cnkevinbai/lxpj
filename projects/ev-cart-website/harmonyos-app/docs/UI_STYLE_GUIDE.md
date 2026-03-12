# 道达智能鸿蒙应用 UI 风格指南

> 版本：v1.0.0  
> 更新日期：2026-03-12  
> 设计：渔晓白 ⚙️

---

## 🎨 设计理念

### 品牌定位

**道达智能** - 专业、高效、可靠的企业级应用

### 设计关键词

| 关键词 | 说明 | 视觉表达 |
|-------|------|---------|
| **专业** | 企业级应用 | 稳重的色彩、规范的布局 |
| **高效** | 快速完成操作 | 清晰的层级、便捷的交互 |
| **可靠** | 数据安全可信 | 一致的反馈、明确的状态 |
| **简洁** | 界面清爽 | 留白、精简的元素 |

---

## 🌈 色彩系统

### 品牌色

```typescript
// 主色 - 科技蓝
const PRIMARY = '#007DFF'

// 辅助色
const PRIMARY_LIGHT = '#3695FF'   // 悬停/渐变
const PRIMARY_DARK = '#0068D6'    // 按下状态
const PRIMARY_LIGHTER = '#E6F4FF' // 背景/选中
```

**使用场景**:
- 主要按钮
- 选中状态
- 链接文字
- 进度指示

### 功能色

```typescript
// 成功 - 绿色
const SUCCESS = '#52C41A'
const SUCCESS_LIGHT = '#73D13D'
const SUCCESS_LIGHTER = '#F6FFED'

// 警告 - 橙色
const WARNING = '#FAAD14'
const WARNING_LIGHT = '#FFC53D'
const WARNING_LIGHTER = '#FFFBE6'

// 错误 - 红色
const ERROR = '#FF4D4F'
const ERROR_LIGHT = '#FF7875'
const ERROR_LIGHTER = '#FFF1F0'

// 信息 - 蓝色
const INFO = '#1890FF'
const INFO_LIGHT = '#40A9FF'
const INFO_LIGHTER = '#E6F7FF'
```

**使用场景**:
- 成功：完成状态、成功提示
- 警告：注意提示、待处理
- 错误：失败状态、删除操作
- 信息：提示说明、链接

### 中性色

```typescript
// 文字颜色
const TEXT_PRIMARY = '#1D1D1F'    // 标题/重要文字
const TEXT_REGULAR = '#333333'    // 正文
const TEXT_SECONDARY = '#666666'  // 次要文字
const TEXT_PLACEHOLDER = '#999999'// 占位符
const TEXT_DISABLED = '#CCCCCC'   // 禁用文字

// 背景颜色
const BG_PAGE = '#F5F5F5'         // 页面背景
const BG_CARD = '#FFFFFF'         // 卡片背景
const BG_DISABLED = '#F5F5F5'     // 禁用背景

// 边框颜色
const BORDER_LIGHT = '#E5E5E5'    // 分割线
const BORDER_NORMAL = '#D9D9D9'   // 边框
const BORDER_DARK = '#BFBFBF'     // 深色边框
```

### 渐变色

```typescript
// 主色渐变
const GRADIENT_PRIMARY = {
  angle: 135,
  colors: ['#007DFF', '#3695FF']
}

// 背景渐变
const GRADIENT_BG = {
  angle: 180,
  colors: ['#F5F7FA', '#E8ECF1']
}

// 卡片渐变
const GRADIENT_CARD = {
  angle: 135,
  colors: ['#FFFFFF', '#F8F9FA']
}
```

---

## 📐 布局系统

### 栅格系统

```typescript
// 列间距
const COLUMN_GAP = 16

// 行间距
const ROW_GAP = 16

// 页面边距
const PAGE_PADDING = 16
```

### 间距规范

```typescript
// 间距级别
const SPACING = {
  xs: 4,    // 超小间距 - 图标与文字
  sm: 8,    // 小间距 - 紧密元素
  md: 12,   // 中间距 - 小组件
  lg: 16,   // 大间距 - 标准间距
  xl: 24,   // 超大间距 - 模块间距
  xxl: 32   // 特大间距 - 大模块
}
```

### 安全区域

```typescript
// 避开系统区域
safeArea: {
  top: true,    // 避开状态栏
  bottom: true, // 避开导航栏
  left: false,
  right: false
}
```

---

## 🔤 字体系统

### 字体家族

```typescript
// 首选字体
const FONT_FAMILY = 'HarmonyOS Sans'

// 备用字体
const FONT_FALLBACK = 'sans-serif'
```

### 字号规范

```typescript
// 字号级别
const FONT_SIZE = {
  xs: 10,   // 提示文字
  sm: 12,   // 辅助文字
  md: 14,   // 正文
  lg: 16,   // 主要正文
  xl: 18,   // 小标题
  xxl: 20,  // 中标题
  xxxl: 24, // 大标题
  xxxx: 32  // 超大标题
}
```

### 字重规范

```typescript
// 字重级别
const FONT_WEIGHT = {
  regular: 400,   // 正文
  medium: 500,    // 按钮/小标题
  bold: 700       // 标题/重要文字
}
```

### 行高规范

```typescript
// 行高 = 字号 + 额外空间
const LINE_HEIGHT = {
  tight: 1.2,     // 紧凑
  normal: 1.5,    // 标准
  loose: 1.8      // 宽松
}
```

---

## 🎭 组件风格

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
  .shadow({
    radius: 8,
    color: 'rgba(0, 125, 255, 0.3)',
    offsetX: 0,
    offsetY: 4
  })
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
  .borderWidth(1)
  .borderColor('#E5E5E5')
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

## 🎬 动效规范

### 缓动曲线

```typescript
// 常用缓动曲线
const CURVE = {
  easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  easeOut: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
  linear: 'linear'
}
```

### 动效时长

```typescript
// 动效时长
const DURATION = {
  fast: 150,    // 快速反馈
  normal: 300,  // 标准动画
  slow: 500     // 慢速动画
}
```

### 常见动效

#### 页面切换

```typescript
router.pushUrl({
  url: '/pages/Detail',
  animation: {
    duration: 300,
    curve: Curve.EaseInOut
  }
})
```

#### 按钮点击

```typescript
Button('提交')
  .onClick(() => {})
  .hoverEffect(true)
  .animation({
    duration: 150,
    curve: Curve.EaseOut
  })
```

#### 列表加载

```typescript
LazyForEach(this.dataSource, (item) => {
  ListItem() {
    CustomerCard(item)
  }
  .animation({
    duration: 200,
    curve: Curve.Linear
  })
}, (item) => item.id)
```

---

## 🌓 暗黑模式

### 色彩映射

```typescript
// 亮色模式
const LIGHT_THEME = {
  bg: '#F5F5F5',
  card: '#FFFFFF',
  text: '#1D1D1F',
  border: '#E5E5E5'
}

// 暗色模式
const DARK_THEME = {
  bg: '#1A1A1A',
  card: '#2D2D2D',
  text: '#FFFFFF',
  border: '#404040'
}
```

### 自动适配

```typescript
// 根据系统主题自动切换
@State themeMode: ThemeMode = ThemeMode.AUTO

// 获取当前主题
const isDark = getThemeMode() === ThemeMode.DARK

// 使用主题颜色
backgroundColor: isDark ? DARK_THEME.bg : LIGHT_THEME.bg
```

---

## 📱 响应式设计

### 屏幕适配

```typescript
// 根据屏幕宽度调整布局
if (screenWidth > 800) {
  // 平板/折叠屏 - 双列布局
  columns: 2
} else {
  // 手机 - 单列布局
  columns: 1
}
```

### 字体适配

```typescript
// 根据屏幕密度调整字体
fontSize: getFontSize(14)  // 基础字号 14
```

---

_道达智能 · 版权所有_
