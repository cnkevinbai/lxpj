# CI/CD 流水线技能

## 📋 技能说明

设计和实现持续集成/持续部署流水线。

---

## 🎯 适用场景

- 自动化构建
- 自动化测试
- 自动化部署

---

## 📝 GitHub Actions 模板

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # 部署脚本
```

---

## ✅ 检查清单

- [ ] 测试覆盖率检查
- [ ] 代码质量扫描
- [ ] 自动化部署
- [ ] 回滚机制

---

## 📚 相关技能

- `docker` - Docker 容器