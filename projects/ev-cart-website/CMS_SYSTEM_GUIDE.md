# CMS 系统完整指南

**版本**: 1.0  
**更新时间**: 2026-03-14  
**状态**: ✅ 生产就绪

---

## 📊 系统概览

道达智能 CMS 内容管理系统覆盖企业内容管理全流程，从新闻发布到案例展示、从解决方案到视频管理，实现企业内容一体化管理。

### 核心模块
| 模块 | 功能 | 状态 |
|------|------|------|
| 新闻管理 | 企业新闻、动态、公告 | ✅ |
| 案例管理 | 客户案例、成功案例 | ✅ |
| 解决方案 | 行业解决方案、产品方案 | ✅ |
| 视频管理 | 企业视频、产品视频 | ✅ |
| 页面配置 | 官网页面配置、布局 | ✅ |
| 站点设置 | SEO、站点参数 | ✅ |

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                   CMS 前端 (React + Vite)                    │
│  /cms  /news  /cases  /solutions  /videos  /pages           │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API
                              │
┌─────────────────────────────────────────────────────────────┐
│                   CMS 后端模块 (NestJS)                      │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │   news   │  cases   │solutions │  videos  │  pages   │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────┐
│                  数据库 (PostgreSQL)                         │
│  cms_news  cms_cases  cms_solutions  cms_videos  cms_pages │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 模块详解

### 1. 新闻管理 (News Management)

**路径**: `/cms/news`  
**后端**: `backend/src/modules/cms/`

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| 新闻发布 | 创建、编辑、发布新闻 | ✅ |
| 新闻分类 | 公司新闻、行业动态、公告 | ✅ |
| 新闻审核 | 审核流程、发布审批 | ✅ |
| 新闻置顶 | 重要新闻置顶 | ✅ |
| 新闻定时 | 定时发布、定时下架 | ✅ |
| 新闻统计 | 阅读量、点赞、分享 | ✅ |

#### 新闻分类
| 分类 | 说明 | 示例 |
|------|------|------|
| 公司新闻 | 企业内部新闻 | 新品发布、获奖信息 |
| 行业动态 | 行业资讯、趋势 | 行业报告、政策解读 |
| 活动公告 | 活动通知、公告 | 展会信息、会议通知 |
| 媒体报导 | 媒体采访、报导 | 新闻稿、采访文章 |

#### 新闻发布流程
```
草稿 → 提交审核 → 审核通过 → 定时/立即发布 → 已发布 → 已下架
```

---

### 2. 案例管理 (Case Management)

**路径**: `/cms/cases`  
**后端**: `backend/src/modules/cms/`

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| 案例创建 | 客户案例、成功案例 | ✅ |
| 案例分类 | 行业分类、产品分类 | ✅ |
| 案例展示 | 图文展示、视频展示 | ✅ |
| 案例推荐 | 推荐案例、精选案例 | ✅ |
| 案例统计 | 阅读量、询盘转化 | ✅ |

#### 案例结构
| 部分 | 内容 |
|------|------|
| 客户信息 | 客户名称、行业、地区 |
| 项目背景 | 客户需求、痛点 |
| 解决方案 | 产品方案、实施方案 |
| 实施效果 | 效果数据、客户评价 |
| 项目图片 | 现场照片、产品图片 |

---

### 3. 解决方案管理 (Solution Management)

**路径**: `/cms/solutions`  
**后端**: `backend/src/modules/cms/`

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| 方案创建 | 行业解决方案、产品方案 | ✅ |
| 方案分类 | 行业分类、场景分类 | ✅ |
| 方案展示 | 图文详情、下载资料 | ✅ |
| 方案推荐 | 热门方案、精选方案 | ✅ |
| 方案统计 | 阅读量、下载量 | ✅ |

#### 解决方案分类
| 分类 | 说明 |
|------|------|
| 行业方案 | 汽车行业、电子行业、机械行业 |
| 产品方案 | 产品 A 方案、产品 B 方案 |
| 场景方案 | 生产场景、仓储场景、物流场景 |

---

### 4. 视频管理 (Video Management)

**路径**: `/cms/videos`  
**后端**: `backend/src/modules/cms/`

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| 视频上传 | 企业视频、产品视频 | ✅ |
| 视频分类 | 企业宣传、产品介绍、教程 | ✅ |
| 视频播放 | 在线播放、下载 | ✅ |
| 视频推荐 | 热门视频、精选视频 | ✅ |
| 视频统计 | 播放量、点赞、分享 | ✅ |

#### 视频分类
| 分类 | 说明 | 示例 |
|------|------|------|
| 企业宣传 | 企业形象片 | 公司介绍、企业文化 |
| 产品介绍 | 产品功能演示 | 产品操作、产品特点 |
| 使用教程 | 产品使用教学 | 安装教程、使用技巧 |
| 客户见证 | 客户评价视频 | 客户采访、使用反馈 |

---

### 5. 页面配置 (Page Configuration)

**路径**: `/cms/pages`  
**后端**: `backend/src/modules/cms/`

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| 页面管理 | 官网页面列表 | ✅ |
| 页面编辑 | 可视化编辑、拖拽布局 | ✅ |
| 页面组件 | 轮播图、新闻列表、案例 | ✅ |
| 页面预览 | 实时预览、多端预览 | ✅ |
| 页面发布 | 发布、回滚 | ✅ |

#### 页面组件库
| 组件 | 说明 |
|------|------|
| 轮播图 | 首页轮播 Banner |
| 新闻列表 | 新闻动态展示 |
| 案例展示 | 成功案例展示 |
| 产品展示 | 产品列表/详情 |
| 联系我们 | 联系方式、地图 |
| 表单组件 | 留言表单、询盘表单 |

---

### 6. 站点设置 (Site Settings)

**路径**: `/cms/settings`  
**后端**: `backend/src/modules/cms/`

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| SEO 设置 | 标题、关键词、描述 | ✅ |
| 站点信息 | 网站名称、LOGO、版权 | ✅ |
| 统计代码 | Google Analytics、百度统计 | ✅ |
| 客服配置 | 在线客服、客服电话 | ✅ |
| 友链管理 | 友情链接管理 | ✅ |

#### SEO 设置
| 字段 | 说明 | 示例 |
|------|------|------|
| 网站标题 | 网站 Title | 道达智能 - 车联网解决方案提供商 |
| 关键词 | Meta Keywords | 车联网，智能硬件，物联网 |
| 描述 | Meta Description | 道达智能专注于车联网解决方案... |
| robots.txt | 搜索引擎爬取规则 | User-agent: * Allow: / |
| sitemap | 网站地图 | sitemap.xml |

---

## 🔄 核心业务流程

### 内容发布流程
```
内容创建 → 内容编辑 → 内容审核 → 定时/立即发布 → 内容展示 → 数据统计
```

### 内容审核流程
```
编辑提交 → 主编审核 → (可选) 法务审核 → 发布
```

---

## 📈 关键指标 (KPI)

| 指标 | 公式 | 目标值 |
|------|------|--------|
| 内容更新频率 | 每周发布内容数 | ≥ 5 篇 |
| 新闻阅读量 | 平均阅读数 | ≥ 500/篇 |
| 案例转化率 | 案例询盘数 / 案例阅读量 | ≥ 3% |
| 视频播放量 | 平均播放数 | ≥ 1000/个 |
| SEO 排名 | 核心关键词排名 | 前 3 页 |
| 页面加载速度 | 平均加载时间 | ≤ 2 秒 |

---

## 🔧 技术实现

### 数据表结构
```sql
-- 新闻表
CREATE TABLE cms_news (
  id UUID PRIMARY KEY,
  title VARCHAR(200),
  category VARCHAR(50),
  content TEXT,
  summary VARCHAR(500),
  cover_image VARCHAR(200),
  author VARCHAR(100),
  view_count INT,
  status VARCHAR(20),
  published_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 案例表
CREATE TABLE cms_cases (
  id UUID PRIMARY KEY,
  title VARCHAR(200),
  customer_name VARCHAR(200),
  industry VARCHAR(100),
  background TEXT,
  solution TEXT,
  results TEXT,
  images TEXT[],
  is_featured BOOLEAN,
  view_count INT,
  created_at TIMESTAMP
);

-- 解决方案表
CREATE TABLE cms_solutions (
  id UUID PRIMARY KEY,
  title VARCHAR(200),
  category VARCHAR(50),
  content TEXT,
  features TEXT[],
  benefits TEXT[],
  download_url VARCHAR(200),
  view_count INT,
  download_count INT,
  created_at TIMESTAMP
);

-- 视频表
CREATE TABLE cms_videos (
  id UUID PRIMARY KEY,
  title VARCHAR(200),
  category VARCHAR(50),
  video_url VARCHAR(200),
  cover_image VARCHAR(200),
  duration INT,
  description TEXT,
  view_count INT,
  like_count INT,
  created_at TIMESTAMP
);

-- 页面配置表
CREATE TABLE cms_pages (
  id UUID PRIMARY KEY,
  page_key VARCHAR(50),
  page_name VARCHAR(100),
  components JSONB,
  seo_title VARCHAR(200),
  seo_keywords VARCHAR(200),
  seo_description VARCHAR(500),
  is_published BOOLEAN,
  published_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 📚 相关文档

- website/README.md
- website/DESIGN_GUIDE.md
- RESPONSIVE_SEO.md
- CONTENT_MANAGEMENT_COMPLETE.md

---

## 🚀 待开发功能

| 功能模块 | 优先级 | 预计完成 |
|---------|--------|---------|
| 可视化编辑器 | 高 | 2026-03-25 |
| 多语言支持 | 中 | 2026-03-30 |
| 内容推荐 | 中 | 2026-04-05 |
| A/B 测试 | 低 | 2026-04-10 |

---

**最后更新**: 2026-03-14  
**下次审查**: 2026-03-21  
**维护人**: 渔晓白 ⚙️
