# 经销商管理模块增强计划

> 创建时间：2026-03-12 20:45  
> 实施人：渔晓白 ⚙️  
> 状态：📋 规划完成

---

## 📊 执行摘要

**目标**: 将经销商管理从基础 CRUD 升级为完整的经销商生命周期管理系统

**当前状态**: 
- ✅ 基础 CRUD 已完成
- ✅ 经销商等级（standard/gold/platinum）
- ✅ 销售目标/实际跟踪
- ❌ 缺少考核系统
- ❌ 缺少返利政策
- ❌ 缺少评级升降级机制

**增强后功能**:
- ✅ 经销商分级管理（5 级）
- ✅ 绩效考核系统（月度/季度/年度）
- ✅ 返利政策引擎
- ✅ 自动升降级机制
- ✅ 经销商画像分析

---

## 🎯 功能规划

### 1. 经销商分级管理

#### 等级体系（5 级）
| 等级 | 代码 | 条件 | 权益 |
|-----|------|------|------|
| 试用经销商 | trial | 新签约<3 个月 | 基础产品授权 |
| 标准经销商 | standard | 签约≥3 个月，年销售≥50 万 | 标准产品授权 |
| 金牌经销商 | gold | 年销售≥200 万，考核≥80 分 | 优先供货、返点 3% |
| 白金经销商 | platinum | 年销售≥500 万，考核≥90 分 | 优先供货、返点 5%、市场支持 |
| 战略经销商 | strategic | 年销售≥1000 万，考核≥95 分 | 最高返点 8%、联合营销 |

#### 升降级规则
- **升级**: 连续 2 个季度考核达标 + 销售目标达成
- **降级**: 连续 2 个季度考核不达标 或 严重违规
- **保级**: 年度考核达标

---

### 2. 绩效考核系统

#### 考核维度
| 维度 | 权重 | 指标 |
|-----|------|------|
| 销售业绩 | 40% | 目标达成率、增长率 |
| 市场开拓 | 20% | 新客户开发、区域覆盖率 |
| 客户服务 | 20% | 客户满意度、投诉率 |
| 合规经营 | 10% | 价格合规、区域合规 |
| 配合度 | 10% | 活动参与、培训参与 |

#### 考核周期
- 月度考核（每月 1-5 日）
- 季度考核（每季度首月 1-10 日）
- 年度考核（次年 1 月 1-15 日）

#### 考核等级
| 分数 | 等级 | 说明 |
|-----|------|------|
| 95-100 | S | 优秀 |
| 85-94 | A | 良好 |
| 70-84 | B | 合格 |
| 60-69 | C | 待改进 |
| <60 | D | 不合格 |

---

### 3. 返利政策引擎

#### 返利类型
| 类型 | 计算方式 | 发放时间 |
|-----|---------|---------|
| 销售返利 | 销售额 × 返点比例 | 季度末 |
| 增长返利 | 同比增长 × 奖励系数 | 年度末 |
| 市场返利 | 市场活动投入 × 匹配比例 | 活动后 |
| 专项返利 | 特定产品/区域奖励 | 项目结束 |

#### 返利计算公式
```
总返利 = 销售返利 + 增长返利 + 市场返利 + 专项返利

销售返利 = ∑(产品线销售额 × 该产品线返点率)
增长返利 = (今年销售额 - 去年销售额) × 增长奖励系数
市场返利 = 市场活动费用 × 公司匹配比例
```

---

### 4. 经销商画像

#### 标签体系
| 分类 | 标签 | 说明 |
|-----|------|------|
| 规模 | 大型/中型/小型 | 基于年销售额 |
| 区域 | 华东/华南/华北等 | 基于经营区域 |
| 行业 | 政府/企业/教育等 | 基于主要客户群 |
| 能力 | 销售型/服务型/综合型 | 基于能力评估 |
| 潜力 | 高潜力/稳定/衰退 | 基于增长趋势 |

---

## 📁 需要创建的文件

### 后端文件（12 个）

```
backend/src/modules/dealer/
├── entities/
│   ├── dealer.entity.ts              # 现有，需增强
│   ├── dealer-assessment.entity.ts   # 新增：考核记录
│   ├── dealer-rebate.entity.ts       # 新增：返利记录
│   └── dealer-level-history.entity.ts # 新增：等级变更历史

├── dto/
│   ├── dealer.dto.ts                 # 现有，需增强
│   ├── dealer-assessment.dto.ts      # 新增
│   └── dealer-rebate.dto.ts          # 新增

├── services/
│   ├── dealer.service.ts             # 现有，需增强
│   ├── dealer-assessment.service.ts  # 新增
│   ├── dealer-rebate.service.ts      # 新增
│   └── dealer-level.service.ts       # 新增：等级管理

├── controllers/
│   ├── dealer.controller.ts          # 现有，需增强
│   ├── dealer-assessment.controller.ts # 新增
│   └── dealer-rebate.controller.ts   # 新增

└── dealer.module.ts                  # 现有，需增强
```

### 数据库迁移（1 个）
```
database/migrations/
└── dealer-enhancement.sql            # 新增：经销商增强表
```

### 前端页面（8 个）
```
crm/src/pages/dealers/
├── Dealers.tsx                       # 现有，需增强
├── DealerDetail.tsx                  # 新增：详情页
├── DealerAssessment.tsx              # 新增：考核管理
├── DealerRebate.tsx                  # 新增：返利管理
├── DealerLevel.tsx                   # 新增：等级管理
├── DealerAnalytics.tsx               # 新增：数据分析
├── CreateDealer.tsx                  # 新增：创建经销商
└── EditDealer.tsx                    # 新增：编辑经销商
```

---

## 🗄️ 数据库变更

### 新增表（3 张）

1. **dealer_assessments** - 经销商考核记录
   - dealerId, period, periodType, scores(JSONB), totalScore, grade
   - 索引：dealerId, period, grade

2. **dealer_rebates** - 经销商返利记录
   - dealerId, rebateType, amount, basis, rate, status, paidAt
   - 索引：dealerId, status, rebateType

3. **dealer_level_histories** - 经销商等级变更历史
   - dealerId, oldLevel, newLevel, reason, approvedBy, effectiveDate
   - 索引：dealerId, effectiveDate

### 修改表（1 张）

**dealers** - 增强字段
- 添加：performanceScore(绩效分数), lastAssessmentDate(最后考核日期)
- 添加：totalRebate(累计返利), nextReviewDate(下次复核日期)

---

## 📊 API 接口规划

### 经销商管理
```
GET    /api/v1/dealers                 # 列表（增强筛选）
POST   /api/v1/dealers                 # 创建
GET    /api/v1/dealers/:id             # 详情
PUT    /api/v1/dealers/:id             # 更新
DELETE /api/v1/dealers/:id             # 删除
GET    /api/v1/dealers/statistics      # 统计（增强）
GET    /api/v1/dealers/analytics       # 分析（新增）
```

### 考核管理
```
GET    /api/v1/dealer-assessments      # 考核列表
POST   /api/v1/dealer-assessments      # 创建考核
GET    /api/v1/dealer-assessments/:id  # 考核详情
PUT    /api/v1/dealer-assessments/:id  # 更新考核
GET    /api/v1/dealer-assessments/dealer/:dealerId  # 经销商考核历史
POST   /api/v1/dealer-assessments/calculate  # 自动计算考核
```

### 返利管理
```
GET    /api/v1/dealer-rebates          # 返利列表
POST   /api/v1/dealer-rebates          # 创建返利
GET    /api/v1/dealer-rebates/:id      # 返利详情
PUT    /api/v1/dealer-rebates/:id      # 更新返利
POST   /api/v1/dealer-rebates/calculate  # 自动计算返利
POST   /api/v1/dealer-rebates/pay      # 发放返利
```

### 等级管理
```
GET    /api/v1/dealer-levels           # 等级列表
PUT    /api/v1/dealer-levels/:dealerId # 调整等级
GET    /api/v1/dealer-levels/history/:dealerId  # 等级变更历史
POST   /api/v1/dealer-levels/evaluate  # 自动评估等级
```

---

## 📅 实施计划

### Phase 1: 数据库和实体（30 分钟）
- [ ] 创建数据库迁移 SQL
- [ ] 创建实体类
- [ ] 创建 DTO

### Phase 2: 服务和控制器（60 分钟）
- [ ] 考核服务和控制器
- [ ] 返利服务和控制器
- [ ] 等级管理服务

### Phase 3: 前端页面（90 分钟）
- [ ] 经销商列表增强
- [ ] 经销商详情页
- [ ] 考核管理页面
- [ ] 返利管理页面

### Phase 4: 测试和文档（30 分钟）
- [ ] API 测试
- [ ] 文档更新
- [ ] 完成报告

**预计总时间**: 3.5 小时

---

## 🎯 成功标准

| 指标 | 目标 |
|-----|------|
| 后端模块 | 100% 完成 |
| 前端页面 | 8 个页面全部完成 |
| API 接口 | 20+ 个接口 |
| 数据库表 | 3 张新表 + 1 张增强 |
| 代码行数 | 3000+ 行 |
| 文档 | 完整 API 文档 + 使用指南 |

---

_渔晓白 ⚙️ · 经销商管理模块增强计划 · 2026-03-12_
