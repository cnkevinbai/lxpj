# iov-platform 测试计划

**测试阶段**: 2026-03-25  
**测试负责人**: 渔晓白  
**测试范围**: 后端模块 + 前端页面

---

## 1. 测试目标

| 目标 | 说明 |
|------|------|
| **功能验证** | 验证所有模块功能正常 |
| **接口测试** | 验证 API 接口正确性 |
| **集成测试** | 验证模块间协作正常 |
| **性能测试** | 验证系统性能达标 |

---

## 2. 测试范围

### 2.1 后端测试

| 模块类型 | 模块数量 | 测试类型 |
|----------|----------|----------|
| Core | 6 | 单元测试 + 集成测试 |
| Business | 9 | 单元测试 + API 测试 |
| Adapter | 2 | 协议测试 |
| Edge | 2 | 功能测试 |
| **总计** | **19** | |

### 2.2 前端测试

| 测试类型 | 范围 |
|----------|------|
| 构建测试 | TypeScript 编译 |
| 类型检查 | 类型定义完整性 |
| 组件测试 | 核心组件渲染 |
| 页面测试 | 页面路由加载 |

---

## 3. 测试用例

### 3.1 后端测试用例

#### 3.1.1 模块生命周期测试

```java
@Test
void testModuleLifecycle() {
    // Given: 模块实例
    // When: initialize -> start -> stop -> destroy
    // Then: 状态正确转换
}
```

#### 3.1.2 ISFU 接口测试

```java
@Test
void testISFUInterface() {
    // Given: 模块实例
    // When: 调用所有接口方法
    // Then: 返回正确结果
}
```

#### 3.1.3 API 接口测试

```java
@Test
void testApiEndpoints() {
    // Given: 运行中的模块
    // When: 发送 API 请求
    // Then: 返回正确响应
}
```

### 3.2 前端测试用例

#### 3.2.1 类型定义测试

```typescript
// 检查类型定义完整性
import type { Terminal, Vehicle, Alarm } from '@/types';
```

#### 3.2.2 组件渲染测试

```typescript
// 检查组件可正常导入
import { PageHeader, SearchBar } from '@/components';
```

---

## 4. 测试执行

### 4.1 后端测试执行

```bash
# 编译检查
mvn compile

# 单元测试
mvn test

# 测试覆盖率
mvn jacoco:report
```

### 4.2 前端测试执行

```bash
# 类型检查
npm run type-check

# 构建测试
npm run build
```

---

## 5. 验收标准

| 指标 | 目标值 |
|------|--------|
| 后端测试通过率 | ≥ 95% |
| 后端代码覆盖率 | ≥ 60% |
| 前端构建 | 成功 |
| TypeScript 错误 | 0 |

---

## 6. 测试报告模板

```
## 测试执行报告

**执行时间**: YYYY-MM-DD HH:mm
**执行人**: XXX

### 后端测试
- 总用例数: XX
- 通过: XX
- 失败: XX
- 跳过: XX
- 覆盖率: XX%

### 前端测试
- TypeScript 编译: 通过/失败
- 构建状态: 成功/失败
- 错误数: XX

### 问题列表
| ID | 模块 | 描述 | 严重度 | 状态 |
|----|------|------|--------|------|
| 1 | XXX | XXX | 高/中/低 | 待修复 |

### 结论
通过/不通过
```