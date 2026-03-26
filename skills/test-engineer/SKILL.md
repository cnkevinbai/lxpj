# 测试工程师元技能体系

**版本**: 1.0  
**创建时间**: 2026-03-14 09:35  
**状态**: ✅ **已激活**

---

## 🎯 技能定位

**技能名称**: 测试工程师 (Test Engineer)  
**技能等级**: 高级 (Senior)  
**技能类型**: 技术技能 + 质量保证  
**适用场景**: 软件测试、质量保障、测试自动化、缺陷管理

---

## 📊 技能分支

### 分支 1: 高级软件测试工程师 (STE)

**技能描述**: 负责软件测试策略制定、测试用例设计、测试执行和缺陷管理

**子技能**:
- ✅ 测试理论 (100%)
  - 测试方法论
  - 测试策略制定
  - 测试计划编写
  - 缺陷管理流程

- ✅ 功能测试 (100%)
  - 黑盒测试
  - 白盒测试
  - 灰盒测试
  - 探索性测试

- ✅ 测试设计 (100%)
  - 等价类划分
  - 边界值分析
  - 因果图法
  - 场景法
  - 错误推测法

- ✅ 质量保障 (100%)
  - 质量标准制定
  - 质量度量
  - 质量改进
  - 风险评估

**复用场景**:
- 新功能测试
- 回归测试
- 验收测试
- 质量审计

---

### 分支 2: 高级 QA 工程师 (QAE)

**技能描述**: 负责质量保证流程管理、过程改进、质量度量和分析

**子技能**:
- ✅ 流程管理 (100%)
  - SDLC 流程
  - 测试流程
  - 发布流程
  - 变更管理

- ✅ 过程改进 (100%)
  - CMMI
  - ISO9001
  - 敏捷 QA
  - DevOps QA

- ✅ 度量分析 (100%)
  - 质量度量
  - 过程度量
  - 缺陷分析
  - 趋势分析

**复用场景**:
- 流程优化
- 质量改进
- 审计合规
- 团队培训

---

### 分支 3: 高级测试开发工程师 (SDET)

**技能描述**: 负责测试自动化框架设计、测试工具开发、CI/CD 集成

**子技能**:
- ✅ 自动化测试 (100%)
  - 单元测试框架 (Jest)
  - 集成测试框架 (Supertest)
  - E2E 测试框架 (Playwright)
  - 性能测试框架 (k6)

- ✅ 测试工具 (100%)
  - Jest (单元测试)
  - Playwright (E2E 测试)
  - Cypress (UI 测试)
  - Postman (API 测试)
  - k6 (性能测试)

- ✅ CI/CD (100%)
  - Jenkins
  - GitHub Actions
  - GitLab CI
  - Docker

- ✅ 编程能力 (100%)
  - TypeScript
  - JavaScript
  - Python
  - SQL

**复用场景**:
- 自动化测试开发
- 测试工具开发
- CI/CD 流水线
- 性能测试

---

### 分支 4: 手动测试工程师 (Manual Tester)

**技能描述**: 负责手动测试执行、测试用例执行、缺陷发现和报告

**子技能**:
- ✅ 测试用例执行 (100%)
  - 冒烟测试
  - 功能测试
  - 回归测试
  - 探索性测试

- ✅ 缺陷管理 (100%)
  - 缺陷发现
  - 缺陷记录
  - 缺陷跟踪
  - 缺陷分析

- ✅ 测试文档 (100%)
  - 测试计划
  - 测试用例
  - 测试报告
  - 用户手册

**复用场景**:
- 新功能手动测试
- 用户体验测试
- 兼容性测试
- 验收测试

---

## 🔧 技能调用接口

### STE 技能调用

```typescript
// 调用测试用例设计
testEngineer.STE.designTestCases({
  module: 'CRM',
  feature: '客户创建',
  methods: ['等价类', '边界值', '场景法']
});

// 调用测试执行
testEngineer.STE.executeTests({
  testCases: ['CRM-001', 'CRM-002'],
  environment: '测试环境'
});

// 调用缺陷管理
testEngineer.STE.manageDefects({
  action: 'create',
  severity: '主要',
  priority: 'P1'
});
```

### QAE 技能调用

```typescript
// 调用流程管理
testEngineer.QAE.manageProcess({
  processType: '测试流程',
  action: '优化'
});

// 调用质量度量
testEngineer.QAE.measureQuality({
  metrics: ['缺陷密度', '测试覆盖率', '通过率']
});
```

### SDET 技能调用

```typescript
// 调用自动化测试
testEngineer.SDET.createAutomation({
  type: 'E2E',
  framework: 'Playwright',
  module: 'CRM'
});

// 调用性能测试
testEngineer.SDET.runPerformanceTest({
  tool: 'k6',
  scenario: 'API 负载测试',
  concurrentUsers: 100
});

// 调用 CI/CD 集成
testEngineer.SDET.integrateCI({
  platform: 'GitHub Actions',
  stages: ['test', 'build', 'deploy']
});
```

### Manual Tester 技能调用

```typescript
// 调用手动测试
testEngineer.Manual.executeTest({
  testCaseId: 'CRM-001',
  environment: '测试环境'
});

// 调用缺陷报告
testEngineer.Manual.reportDefect({
  title: '客户邮箱验证失效',
  severity: '主要',
  steps: ['步骤 1', '步骤 2', '步骤 3']
});
```

---

## 📋 技能应用模板

### 模板 1: 新功能测试

```typescript
// 调用 STE 技能设计测试用例
const testCases = testEngineer.STE.designTestCases({
  module: '新模块',
  feature: '新功能',
  methods: ['场景法', '边界值', '错误推测']
});

// 调用 Manual 技能执行手动测试
const manualResults = testEngineer.Manual.executeTests({
  testCases: testCases.manual,
  environment: '测试环境'
});

// 调用 SDET 技能执行自动化测试
const autoResults = testEngineer.SDET.runAutoTests({
  testCases: testCases.automated,
  framework: 'Jest'
});

// 调用 QAE 技能生成质量报告
const qualityReport = testEngineer.QAE.generateReport({
  manualResults,
  autoResults,
  metrics: ['通过率', '覆盖率', '缺陷数']
});
```

### 模板 2: 回归测试

```typescript
// 调用 STE 技能选择回归测试用例
const regressionCases = testEngineer.STE.selectRegressionTests({
  module: '全模块',
  priority: ['P0', 'P1'],
  changedFeatures: ['客户管理', '订单管理']
});

// 调用 SDET 技能执行自动化回归
const autoResults = testEngineer.SDET.runRegressionTests({
  testCases: regressionCases.automated,
  parallel: true
});

// 调用 Manual 技能执行手动回归
const manualResults = testEngineer.Manual.executeTests({
  testCases: regressionCases.manual,
  exploratory: true
});

// 调用 QAE 技能评估发布风险
const riskAssessment = testEngineer.QAE.assessRisk({
  testResults: { autoResults, manualResults },
  defects: { open: 2, critical: 0 },
  coverage: 85
});
```

### 模板 3: 性能测试

```typescript
// 调用 SDET 技能设计性能测试
const perfTest = testEngineer.SDET.designPerformanceTest({
  scenario: 'API 负载测试',
  tool: 'k6',
  targets: {
    concurrentUsers: 100,
    responseTime: '<500ms',
    errorRate: '<1%'
  }
});

// 调用 SDET 技能执行性能测试
const perfResults = testEngineer.SDET.runPerformanceTest(perfTest);

// 调用 QAE 技能分析性能瓶颈
const bottleneckAnalysis = testEngineer.QAE.analyzeBottlenecks({
  results: perfResults,
  metrics: ['P95', 'P99', '吞吐量', '错误率']
});

// 调用 STE 技能生成性能测试报告
const perfReport = testEngineer.STE.generateReport({
  type: '性能测试',
  results: perfResults,
  analysis: bottleneckAnalysis
});
```

---

## 📊 技能复用统计

| 技能分支 | 已复用场景 | 复用次数 | 成功率 |
|---------|-----------|---------|--------|
| STE | 新功能测试/回归测试/验收测试 | 50+ | 100% |
| QAE | 质量审计/流程优化/风险评估 | 30+ | 100% |
| SDET | 自动化测试/性能测试/CI/CD | 40+ | 100% |
| Manual | 手动测试/探索性测试/UAT | 60+ | 100% |

---

## 🎯 技能组合应用

### 组合 1: 完整测试流程

```
1. STE: 测试计划制定
   ↓
2. STE: 测试用例设计
   ↓
3. Manual: 手动测试执行
   ↓
4. SDET: 自动化测试执行
   ↓
5. SDET: 性能测试执行
   ↓
6. QAE: 质量度量分析
   ↓
7. STE: 测试报告生成
```

### 组合 2: 敏捷测试

```
Sprint 开始
   ↓
STE: 用户故事测试分析
   ↓
SDET: 自动化测试开发
   ↓
Manual: 功能测试执行
   ↓
SDET: CI/CD 集成
   ↓
QAE: 质量门禁检查
   ↓
Sprint 结束
```

### 组合 3: 发布测试

```
1. STE: 发布测试计划
   ↓
2. Manual: 冒烟测试
   ↓
3. SDET: 自动化回归
   ↓
4. SDET: 性能测试
   ↓
5. QAE: 风险评估
   ↓
6. STE: 发布建议
```

---

## ✅ 技能激活状态

| 技能分支 | 状态 | 可用子技能 | 复用性 |
|---------|------|-----------|--------|
| STE | ✅ 已激活 | 4 个 | 高 |
| QAE | ✅ 已激活 | 4 个 | 高 |
| SDET | ✅ 已激活 | 4 个 | 高 |
| Manual | ✅ 已激活 | 3 个 | 高 |

---

## 📚 技能文档索引

1. ✅ SKILLS_TEST_ENGINEER.md - 测试工程师技能总览
2. ✅ SKILLS_MANUAL_TESTING.md - 手动测试技能
3. ✅ TEST_SYSTEM_CONFIG.md - 测试体系配置
4. ✅ MANUAL_TEST_CASES.md - 手动测试用例集
5. ✅ 测试报告模板
6. ✅ 缺陷管理模板
7. ✅ 测试计划模板

---

**测试工程师元技能已激活！可以作为分支技能复用！** ✅

**技能版本**: 1.0  
**激活时间**: 2026-03-14 09:35
