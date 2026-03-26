# 后端模块结构修复说明

**问题**: 模块目录结构不统一
**修复方案**: 统一所有模块在 `src/modules/` 目录下

**当前结构**:
```
backend/src/
├── app.module.ts
├── main.ts
├── auth/          ← 直接在 src 下
├── user/          ← 直接在 src 下
├── service-ticket/ ← 直接在 src 下
└── ...

**目标结构**:
```
backend/src/
├── app.module.ts
├── main.ts
└── modules/
    ├── auth/
    ├── user/
    ├── service-ticket/
    └── ...
```

**修复步骤**:
1. 创建 `src/modules/` 目录
2. 移动所有模块到 `modules/` 下
3. 更新 `app.module.ts` 导入路径
4. 测试编译
