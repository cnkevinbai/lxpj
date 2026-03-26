# 道达智能官网 - NEXUS 终极版设计方案

**版本**: v2.0 Ultimate  
**更新时间**: 2026-03-15 15:56  
**风格定位**: 黑蓝科技风 + 未来感 + 酷炫动效

---

## 🎯 核心需求确认

| 需求项 | 规格 |
|--------|------|
| **动效方案** | ✅ 原 30+ 种动效，更酷炫 |
| **色彩风格** | ✅ 黑蓝科技风 |
| **视觉定位** | ✅ 未来科技感 (实体制造企业也需要科技感) |
| **导航形式** | ✅ 响应式：PC 横向 / 移动汉堡 |
| **标题字数** | ✅ 4-12 字精炼 |
| **浏览器标题** | ✅ 道达智能车辆制造创新平台 |

---

## 🎨 色彩方案 - 黑蓝科技风

### 主色调

```css
/* 黑色系 - 深邃背景 */
--black-deep: #050505;      /* 极邃黑 - 主背景 */
--black-primary: #0A0A0A;   /* 深邃黑 - 次级背景 */
--black-card: #121212;      /* 碳素黑 - 卡片 */
--black-nav: #1A1A1A;       /* 深空黑 - 导航 */

/* 白色系 - 文字 */
--white-primary: #FFFFFF;   /* 纯白 - 主标题 */
--white-body: #E0E0E0;      /* 浅灰白 - 正文 */
--white-secondary: #A0A0A0; /* 中灰 - 次要文字 */
--white-border: #606060;    /* 深灰 - 边框 */

/* 蓝色系 - 强调色 */
--blue-primary: #0066FF;    /* 道达蓝 - 主强调 */
--blue-hover: #0088FF;      /* 亮蓝 - 悬停 */
--blue-light: #00AAFF;      /* 天蓝 - 渐变起点 */
--blue-tech: #00D4FF;       /* 科技蓝 - 渐变终点 */

/* 特殊色 */
--green-energy: #00FF88;    /* 能量绿 - 新能源 */
--red-alert: #FF3366;       /* 警示红 - 警告 */
```

### 渐变方案

```css
/* 主渐变 - 蓝调科技 */
--gradient-primary: linear-gradient(135deg, #0066FF 0%, #00D4FF 100%);

/* 光晕效果 */
--glow-blue: radial-gradient(circle, rgba(0,102,255,0.2) 0%, transparent 70%);

/* 能量线 */
--energy-line: linear-gradient(90deg, 
  transparent 0%, 
  #0066FF 25%, 
  #00D4FF 50%, 
  #0066FF 75%, 
  transparent 100%
);
```

### 色彩比例

```
背景色：90% (黑色系)
文字色：10% (白色系)
强调色：<5% (蓝色系)
产品色：唯一的主要色彩来源
```

---

## 📐 响应式导航设计

### PC 端 (≥1024px) - 横向导航

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [LOGO]  产品中心 ▼  解决方案 ▼  技术创新  关于我们  联系我们            │
│                                      [🔍] [数字化平台 ▼] [EN] [登录]    │
└─────────────────────────────────────────────────────────────────────────┘

规格:
- 高度：80px (滚动后 64px)
- 背景：透明 → rgba(5, 5, 5, 0.95) + backdrop-filter: blur(20px)
- Logo: 左侧固定
- 导航项：居中排列
- 功能按钮：右侧
- 下拉菜单：Mega Menu 设计
```

### 移动端 (<1024px) - 汉堡菜单

```
┌─────────────────────────────────────────────────────────────────┐
│  [☰]              道达智能                    [数字化平台] [EN] │
└─────────────────────────────────────────────────────────────────┘

点击后从左侧滑出全屏菜单:

┌──────────────────────────────┐
│  [×]  菜单                   │
│  ═══════════════════════════ │
│                              │
│  产品中心              →     │
│  解决方案              →     │
│  技术创新              →     │
│  关于我们              →     │
│  联系我们              →     │
│  ─────────────────────────── │
│  数字化平台            →     │
│  登录                  →     │
│                              │
│  ─────────────────────────── │
│                              │
│  [道达 Logo]                 │
│  道达智能车辆制造创新平台     │
│  © 2026 道达智能车辆          │
│                              │
│  [微信] [微博] [LinkedIn]    │
└──────────────────────────────┘

规格:
- 背景：rgba(5, 5, 5, 0.98)
- 动画：slide-in 300ms ease-out
- 菜单项：交错延迟 50ms
- 底部：社交媒体 + 版权
```

---

## 🎬 动效系统 - 30+ 种酷炫动效

### 1. 页面加载动效 (6 种)

#### 1.1 Logo 淡入
```css
@keyframes logo-fade-in {
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
animation: logo-fade-in 400ms ease-out;
```

#### 1.2 Hero 标题逐字显现
```css
@keyframes text-reveal {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.title-word {
  display: inline-block;
  animation: text-reveal 500ms ease-out;
  animation-delay: calc(var(--word-index) * 100ms);
}
```

#### 1.3 CTA 光晕扩散
```css
@keyframes glow-pulse {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(0, 102, 255, 0.3);
  }
  50% { 
    box-shadow: 0 0 40px rgba(0, 102, 255, 0.6),
                0 0 60px rgba(0, 212, 255, 0.3);
  }
}
animation: glow-pulse 1.5s ease-in-out infinite;
```

#### 1.4 骨架屏脉动
```css
@keyframes skeleton-pulse {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #1A1A1A 0%,
    #252525 50%,
    #1A1A1A 100%
  );
  background-size: 200px 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
```

#### 1.5 图片渐进加载
```javascript
// 步骤:
// 1. 低分辨率占位 (blur: 20px)
// 2. 真实图片加载完成
// 3. blur 20px→0 (500ms)
// 4. scale 1.05→1 (300ms)
```

#### 1.6 数字滚动计数
```javascript
function animateNumber(element, target, duration = 2000) {
  // 数字从 0 滚动到目标值
  // easing: easeOutExpo
}
```

---

### 2. 滚动交互动效 (6 种)

#### 2.1 导航栏变形
```javascript
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    nav.style.height = '64px';
    nav.style.background = 'rgba(5, 5, 5, 0.95)';
    nav.style.backdropFilter = 'blur(20px)';
  } else {
    nav.style.height = '80px';
    nav.style.background = 'transparent';
  }
});
```

#### 2.2 板块滑入
```css
@keyframes section-enter {
  0% {
    opacity: 0;
    transform: translateY(60px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.section {
  animation: section-enter 600ms ease-out;
}
```

#### 2.3 进度指示器
```css
.progress-bar {
  position: fixed;
  right: 0;
  top: 0;
  width: 2px;
  height: calc(scrollY / scrollHeight * 100%);
  background: linear-gradient(#0066FF, #00D4FF);
  box-shadow: 0 0 10px rgba(0, 102, 255, 0.5);
}
```

#### 2.4 视差滚动
```css
.parallax-bg {
  transform: translateY(calc(scrollY * 0.5));
}

.parallax-fg {
  transform: translateY(calc(scrollY * 1.0));
}
```

#### 2.5 交错延迟
```css
.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 100ms; }
.card:nth-child(3) { animation-delay: 200ms; }
.card:nth-child(4) { animation-delay: 300ms; }
```

---

### 3. 悬停效果动效 (8 种)

#### 3.1 产品卡片三部曲
```css
@keyframes card-hover {
  0% {
    transform: translateY(0) scale(1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: translateY(-12px) scale(1.02);
  }
  100% {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 20px 40px rgba(0, 102, 255, 0.3),
                0 0 60px rgba(0, 212, 255, 0.1);
  }
}

.card:hover {
  animation: card-hover 0.5s ease forwards;
}
```

#### 3.2 按钮悬停三部曲
```css
/* 阶段 1 (0-150ms): 放大 + 变色 */
.btn:hover {
  transform: scale(1.05);
  background: #0077FF;
  transition: all 150ms ease;
}

/* 阶段 2 (150-300ms): 光晕扩散 */
.btn:hover {
  box-shadow: 0 0 30px rgba(0, 102, 255, 0.5);
  transition-delay: 150ms;
}

/* 阶段 3 (300ms+): 粒子扩散 */
.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  transform: scale(0);
  transition: transform 0.5s ease;
}

.btn:hover::after {
  transform: scale(2);
}
```

#### 3.3 导航下划线
```css
.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #0066FF, #00D4FF);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}
```

#### 3.4 菜单项旋转
```css
.menu-item:hover .icon {
  transform: rotate(5deg);
  color: #0066FF;
  transition: all 0.3s ease;
}
```

#### 3.5 底部光晕扩散
```css
.card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scale(0);
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, #0066FF, #00D4FF, #0066FF, transparent
  );
  transition: transform 0.5s ease;
}

.card:hover::after {
  transform: translateX(-50%) scale(1);
}
```

---

### 4. 点击反馈动效 (3 种)

#### 4.1 按钮涟漪
```css
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  animation: ripple 0.6s ease-out;
  pointer-events: none;
}
```

#### 4.2 卡片回弹
```
点击：scale 1 → 0.98 (100ms)
释放：scale 0.98 → 1.02 (150ms)
回弹：scale 1.02 → 1 (200ms)
```

---

### 5. 转场动画 (4 种)

#### 5.1 页面切换
```css
.page-exit {
  animation: fade-out-up 0.4s ease-in;
}

.page-enter {
  animation: fade-in-up 0.5s ease-out 0.1s both;
}
```

#### 5.2 模态框展开
```css
@keyframes modal-expand {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

---

### 6. 高级特效 (5 种)

#### 6.1 粒子背景
```javascript
// Canvas 渲染 50-100 个粒子
// 大小：2-6px 随机
// 颜色：rgba(0, 102, 255, 0.3-0.6)
// 运动：缓慢漂浮 + 鼠标互动排斥
```

#### 6.2 光标跟随光晕
```css
.cursor-glow {
  position: fixed;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(0, 102, 255, 0.15) 0%,
    transparent 70%
  );
  transform: translate(-50%, -50%);
  pointer-events: none;
  mix-blend-mode: screen;
}
```

#### 6.3 文字渐变显现
```css
.hero-title {
  background: linear-gradient(
    90deg,
    #8C8C8C 0%,
    #FFFFFF 25%,
    #0066FF 50%,
    #FFFFFF 75%,
    #8C8C8C 100%
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: text-reveal 3s ease-out;
}
```

#### 6.4 能量线流动
```css
@keyframes energy-flow {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

.energy-line {
  animation: energy-flow 2s ease-in-out infinite;
}
```

#### 6.5 3D 倾斜卡片
```javascript
card.addEventListener('mousemove', (e) => {
  const rotateX = (e.clientY - centerY) / 20;
  const rotateY = (centerX - e.clientX) / 20;
  card.style.transform = `
    perspective(1000px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale(1.02)
  `;
});
```

---

## 📝 文案规范 - 4-12 字精炼

### Hero 标题 (4 字)

| 产品 | 标题 | 副标题 (≤12 字) |
|------|------|----------------|
| 无人驾驶观光车 | 境·界全开 | L4 自动驾驶，定义未来出行 |
| 新能源观光车 | 驭·风而行 | 800km 续航，绿色零排放 |
| 电动巡逻车 | 守·护者 | 静默巡逻，迅捷响应 |
| 高尔夫球车 | 尊·享行 | 奢华舒适，球场风尚 |
| 共享漫游车 | 智·享游 | 扫码即走，智慧景区 |

### 板块标题 (4-8 字)

| 板块 | 标题 |
|------|------|
| 产品展示 | 全系列产品 |
| 技术创新 | 技术，无界 |
| 全球案例 | 足迹，遍布全球 |
| 关于我们 | 道达，智造未来 |

### 技术亮点 (4 字)

| 技术 | 标题 | 数据 |
|------|------|------|
| 电池 | 远，不止 | 800km |
| 智驾 | 智，无界 | L4 级 |
| 网联 | 瞬，互联 | 5G |

---

## 🌐 浏览器标题

```html
<title>道达智能车辆制造创新平台</title>
<meta name="application-name" content="道达智能车辆制造创新平台">
```

---

## 📊 最终规格确认

| 项目 | 规格 |
|------|------|
| **动效** | 30+ 种，酷炫 |
| **色彩** | 黑蓝科技风 |
| **导航** | PC 横向 / 移动汉堡 |
| **标题** | 4-12 字精炼 |
| **浏览器标题** | 道达智能车辆制造创新平台 |
| **视觉** | 未来科技感 |
| **定位** | 实体制造企业 + 科技感 UI |

---

**文档版本**: v2.0 Ultimate  
**创建时间**: 2026-03-15 15:56  
**状态**: ✅ 最终确认版
