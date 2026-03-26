# CSS 样式开发技能

## 📋 技能说明

使用 Tailwind CSS 和 CSS Modules 进行样式开发，创建响应式、可维护的 UI。

---

## 🎯 适用场景

- 组件样式开发
- 响应式布局
- 主题定制
- 动画效果

---

## 📝 Tailwind CSS 常用类

### 布局

```html
<!-- Flex 布局 -->
<div class="flex items-center justify-between">
  <span>左侧</span>
  <span>右侧</span>
</div>

<!-- Grid 布局 -->
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- 响应式 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- 手机1列，平板2列，桌面3列 -->
</div>
```

### 间距

```html
<!-- 内边距 -->
<div class="p-4">        <!-- 16px -->
<div class="px-4 py-2">  <!-- 左右16px，上下8px -->

<!-- 外边距 -->
<div class="m-4">        <!-- 16px -->
<div class="mt-4 mb-2">  <!-- 上16px，下8px -->
```

### 文字

```html
<span class="text-sm font-medium text-gray-900">标题</span>
<span class="text-xs text-gray-500">描述</span>
```

### 按钮

```html
<!-- 主按钮 -->
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
  确定
</button>

<!-- 次按钮 -->
<button class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
  取消
</button>
```

### 表单

```html
<input 
  type="text" 
  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="请输入"
/>
```

### 卡片

```html
<div class="bg-white rounded-lg shadow p-4">
  <h3 class="text-lg font-medium">卡片标题</h3>
  <p class="text-gray-600 mt-2">卡片内容</p>
</div>
```

---

## ✅ 检查清单

- [ ] 使用语义化 HTML
- [ ] 响应式适配
- [ ] 有 hover/focus 状态
- [ ] 颜色使用统一变量
- [ ] 间距符合 4px 网格

---

## 📚 相关技能

- `react-component` - React 组件开发