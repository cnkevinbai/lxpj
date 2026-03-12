# CMS 内容管理系统完整指南

> 道达智能官网 · 管理后台  
> 版本：v2.0  
> 完成时间：2026-03-12  
> 状态：✅ 已完成

---

## 📋 目录

1. [系统概述](#系统概述)
2. [功能模块](#功能模块)
3. [快速开始](#快速开始)
4. [使用指南](#使用指南)
5. [API 文档](#api 文档)
6. [数据库设计](#数据库设计)
7. [最佳实践](#最佳实践)

---

## 系统概述

### 架构设计

```
┌──────────────────────────────────────────┐
│          CRM 管理后台 (React)             │
│  ┌────────────────────────────────────┐ │
│  │  CasesManager.tsx   - 案例管理     │ │
│  │  NewsManager.tsx    - 新闻管理     │ │
│  │  VideosManager.tsx  - 视频管理     │ │
│  │  SolutionsManager.tsx - 解决方案   │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
                    ↓ REST API
┌──────────────────────────────────────────┐
│        Backend (NestJS + TypeORM)        │
│  ┌────────────────────────────────────┐ │
│  │  cms.controller.ts  - 路由控制     │ │
│  │  cms.service.ts     - 业务逻辑     │ │
│  │  *.entity.ts        - 数据模型     │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
                    ↓ TypeORM
┌──────────────────────────────────────────┐
│        Database (PostgreSQL)             │
│  - cases    (案例表)                     │
│  - news     (新闻表)                     │
│  - videos   (视频表)                     │
│  - solutions (解决方案表)                │
└──────────────────────────────────────────┘
```

### 技术栈

**前端**:
- React 18 + TypeScript
- Ant Design 5.x
- Tailwind CSS

**后端**:
- NestJS 10.x
- TypeORM
- PostgreSQL 14
- JWT 认证

---

## 功能模块

### 1. 案例管理

**功能**:
- ✅ 案例列表（表格展示）
- ✅ 新建案例（表单）
- ✅ 编辑案例
- ✅ 删除案例（单个/批量）
- ✅ 状态管理（已发布/草稿/归档）
- ✅ 图片上传（最多 10 张）
- ✅ 分类筛选
- ✅ 统计卡片

**字段**:
| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| title | 文本 (200) | ✅ | 案例标题 |
| category | 文本 (50) | ✅ | 分类 |
| location | 文本 (100) | ✅ | 地点 |
| year | 数字 | ✅ | 年份 |
| vehicles | 数字 | ✅ | 车辆数 |
| dailyPassengers | 数字 | ❌ | 日均人次 |
| description | 文本 | ✅ | 描述 |
| challenge | 文本 | ✅ | 挑战 |
| solution | 文本 | ✅ | 解决方案 |
| results | 文本数组 | ✅ | 成果 |
| testimonialQuote | 文本 | ❌ | 客户评价 |
| testimonialAuthor | 文本 (100) | ❌ | 评价人 |
| testimonialPosition | 文本 (100) | ❌ | 职位 |
| images | 文本数组 | ❌ | 图片 URL |
| status | 枚举 | ✅ | 状态 |
| viewCount | 数字 | - | 浏览量 |
| orderIndex | 数字 | - | 排序 |

---

### 2. 新闻管理

**功能**:
- ✅ 新闻列表
- ✅ 新建新闻
- ✅ 编辑新闻
- ✅ 删除新闻（单个/批量）
- ✅ 状态管理（已发布/草稿/定时）
- ✅ 封面上传
- ✅ 标签系统
- ✅ 阅读量统计
- ✅ SEO 字段

**字段**:
| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| title | 文本 (200) | ✅ | 新闻标题 |
| category | 文本 (50) | ✅ | 分类 |
| author | 文本 (50) | ✅ | 作者 |
| publishDate | 日期 | ❌ | 发布时间 |
| excerpt | 文本 | ✅ | 摘要 |
| content | 文本 | ✅ | 正文 (HTML) |
| coverImage | 文本 | ❌ | 封面图 |
| tags | 文本数组 | ❌ | 标签 |
| viewCount | 数字 | - | 阅读量 |
| status | 枚举 | ✅ | 状态 |
| scheduledAt | 日期 | ❌ | 定时时间 |
| seoTitle | 文本 (200) | ❌ | SEO 标题 |
| seoDescription | 文本 | ❌ | SEO 描述 |
| seoKeywords | 文本 | ❌ | SEO 关键词 |

---

### 3. 视频管理

**功能**:
- ✅ 视频列表
- ✅ 新建视频
- ✅ 编辑视频
- ✅ 删除视频（单个/批量）
- ✅ 状态管理（已发布/草稿）
- ✅ 多平台支持（B 站/优酷/本地）
- ✅ 封面上传
- ✅ 播放量统计
- ✅ 点赞功能

**字段**:
| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| title | 文本 (200) | ✅ | 视频标题 |
| category | 文本 (50) | ✅ | 分类 |
| videoUrl | 文本 (500) | ✅ | 视频链接 |
| videoType | 枚举 | ✅ | 来源 |
| thumbnail | 文本 | ❌ | 封面图 |
| duration | 文本 (20) | ❌ | 时长 |
| description | 文本 | ✅ | 描述 |
| tags | 文本数组 | ❌ | 标签 |
| viewCount | 数字 | - | 播放量 |
| likeCount | 数字 | - | 点赞数 |
| status | 枚举 | ✅ | 状态 |
| publishedAt | 日期 | ❌ | 发布时间 |
| orderIndex | 数字 | - | 排序 |

---

### 4. 解决方案管理

**功能**:
- ✅ 方案列表
- ✅ 新建方案
- ✅ 编辑方案
- ✅ 删除方案（单个/批量）
- ✅ 状态管理
- ✅ 图标选择
- ✅ 颜色选择
- ✅ 排序功能

**字段**:
| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| title | 文本 (200) | ✅ | 方案标题 |
| icon | 文本 (50) | ✅ | Emoji 图标 |
| color | 文本 (50) | ✅ | 渐变颜色 |
| description | 文本 | ✅ | 描述 |
| features | 文本数组 | ✅ | 核心功能 |
| applicable | 文本 | ✅ | 适用场景 |
| vehicles | 文本 | ✅ | 推荐车型 |
| orderIndex | 数字 | - | 排序 |
| status | 枚举 | ✅ | 状态 |

---

## 快速开始

### 1. 数据库迁移

```bash
# 进入后端目录
cd backend

# 生成迁移文件
npm run typeorm -- migration:generate src/migrations/AddCmsTables -d src/datasource.ts

# 运行迁移
npm run typeorm -- migration:run -d src/datasource.ts
```

### 2. 启动后端

```bash
cd backend
npm run start:dev
```

### 3. 启动 CRM 后台

```bash
cd crm
npm run dev
```

### 4. 访问管理后台

```
http://localhost:3001
```

默认账号：
- 用户名：admin
- 密码：admin123

---

## 使用指南

### 发布新案例

1. 登录 CRM 后台
2. 进入 **CMS 内容管理** → **案例管理**
3. 点击 **新建案例**
4. 填写信息：
   - 案例标题
   - 分类（景区/酒店/园区/城市观光）
   - 地点、年份、车辆数
   - 案例描述
   - 面临挑战
   - 解决方案
   - 项目成果（每行一个）
   - 客户评价（可选）
   - 上传图片（最多 10 张）
5. 选择状态（草稿/已发布）
6. 点击 **保存**

### 发布新闻

1. 进入 **新闻管理**
2. 点击 **新建新闻**
3. 填写信息：
   - 新闻标题
   - 分类（公司动态/产品发布等）
   - 作者
   - 摘要
   - 正文（支持 HTML）
   - 封面图
   - 标签
4. 设置发布时间（可定时）
5. 填写 SEO 信息（可选）
6. 点击 **保存**

### 上传视频

1. 进入 **视频管理**
2. 点击 **新建视频**
3. 填写信息：
   - 视频标题
   - 分类（产品介绍/客户见证等）
   - 视频来源（B 站/优酷/本地）
   - 视频链接
   - 封面图
   - 描述
   - 标签
4. 点击 **保存**

### 管理解决方案

1. 进入 **解决方案管理**
2. 点击 **新建解决方案**
3. 填写信息：
   - 方案标题
   - 图标 Emoji
   - 渐变颜色
   - 方案描述
   - 核心功能（每行一个）
   - 适用场景
   - 推荐车型
4. 点击 **保存**

---

## API 文档

### 基础 URL

```
/api/v1/cms
```

### 认证

所有接口需要 JWT Token，在 Header 中携带：

```
Authorization: Bearer <token>
```

### 案例接口

```
GET    /cases              # 获取案例列表
GET    /cases/:id          # 获取单个案例
POST   /cases              # 创建案例
PUT    /cases/:id          # 更新案例
DELETE /cases/:id          # 删除案例
POST   /cases/batch-delete # 批量删除

Query Parameters:
- status: 状态筛选 (published/draft/archived)
```

### 新闻接口

```
GET    /news               # 获取新闻列表
GET    /news/:id           # 获取单个新闻
POST   /news               # 创建新闻
PUT    /news/:id           # 更新新闻
DELETE /news/:id           # 删除新闻
POST   /news/batch-delete  # 批量删除

Query Parameters:
- status: 状态筛选
- category: 分类筛选
```

### 视频接口

```
GET    /videos             # 获取视频列表
GET    /videos/:id         # 获取单个视频
POST   /videos             # 创建视频
PUT    /videos/:id         # 更新视频
DELETE /videos/:id         # 删除视频
POST   /videos/batch-delete# 批量删除
POST   /videos/:id/like    # 点赞视频

Query Parameters:
- status: 状态筛选
- category: 分类筛选
```

### 解决方案接口

```
GET    /solutions          # 获取解决方案列表
GET    /solutions/:id      # 获取单个方案
POST   /solutions          # 创建方案
PUT    /solutions/:id      # 更新方案
DELETE /solutions/:id      # 删除方案
POST   /solutions/batch-delete # 批量删除

Query Parameters:
- status: 状态筛选
```

### 统计接口

```
GET    /stats              # 获取统计数据
```

返回示例：
```json
{
  "caseCount": 25,
  "newsCount": 150,
  "videoCount": 30,
  "solutionCount": 6,
  "totalViews": 125000
}
```

---

## 数据库设计

### cases 表

```sql
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  location VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  vehicles INTEGER NOT NULL,
  daily_passengers INTEGER,
  description TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  results TEXT[],
  testimonial_quote TEXT,
  testimonial_author VARCHAR(100),
  testimonial_position VARCHAR(100),
  images TEXT[],
  status VARCHAR(20) DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### news 表

```sql
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  author VARCHAR(50) NOT NULL,
  publish_date TIMESTAMP,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image VARCHAR(500),
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft',
  scheduled_at TIMESTAMP,
  seo_title VARCHAR(200),
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### videos 表

```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  video_url VARCHAR(500) NOT NULL,
  video_type VARCHAR(20) DEFAULT 'bilibili',
  thumbnail VARCHAR(500),
  duration VARCHAR(20),
  description TEXT NOT NULL,
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### solutions 表

```sql
CREATE TABLE solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  color VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] NOT NULL,
  applicable TEXT NOT NULL,
  vehicles TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 最佳实践

### 内容规范

#### 案例撰写
- **标题**: 包含客户名称 + 项目类型，如"张家界国家森林公园观光车项目"
- **描述**: 200 字以内，突出项目亮点
- **挑战**: 描述客户面临的问题
- **解决方案**: 说明提供的产品和服务
- **成果**: 用数据说话，如"日均服务 10000+ 人次"
- **图片**: 至少 3 张，包含车辆、场景、细节

#### 新闻撰写
- **标题**: 简洁明了，包含关键词
- **摘要**: 100-200 字，概括核心内容
- **正文**: 分段清晰，使用小标题
- **封面**: 高质量图片，1200x630 像素
- **SEO**: 填写 meta title 和 description

#### 视频上传
- **封面**: 清晰吸引，1280x720 像素
- **标题**: 包含关键词，如"工厂实拍"
- **描述**: 简要介绍视频内容
- **分类**: 选择准确的分类
- **标签**: 3-5 个相关标签

### 发布流程

1. **草稿阶段**: 先保存为草稿，完善内容
2. **审核阶段**: 主管审核内容准确性
3. **发布阶段**: 设置为已发布
4. **推广阶段**: 同步到社交媒体

### SEO 优化

1. **标题优化**: 包含核心关键词
2. **描述优化**: 150-160 字符，吸引点击
3. **关键词**: 3-5 个相关关键词
4. **图片 Alt**: 添加描述性文字
5. **内部链接**: 相关文章互链

---

## 故障排查

### 常见问题

**Q1: 图片上传失败？**
- 检查文件大小（< 10MB）
- 检查文件格式（JPG/PNG）
- 检查上传目录权限

**Q2: API 请求 401？**
- Token 过期，重新登录
- 检查 Header 格式

**Q3: 数据不显示？**
- 检查状态是否为已发布
- 清除浏览器缓存

---

## 更新日志

### v2.0 (2026-03-12)
- ✅ 新增案例管理
- ✅ 新增新闻管理
- ✅ 新增视频管理
- ✅ 新增解决方案管理
- ✅ 批量操作支持
- ✅ SEO 字段支持

### v1.0 (2026-03-11)
- ✅ 基础 CMS 架构
- ✅ 案例和新闻实体

---

_渔晓白 · AI 系统构建者 · 2026-03-12_

**文档版本**: v2.0  
**最后更新**: 2026-03-12
