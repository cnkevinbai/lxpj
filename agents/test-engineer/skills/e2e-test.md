# E2E 测试技能

## 📋 技能说明

使用 Playwright/Cypress 进行端到端测试。

---

## 🎯 适用场景

- 流程测试
- UI 自动化
- 回归测试

---

## 📝 Playwright 示例

```typescript
test('用户登录流程', async ({ page }) => {
  await page.goto('/login')
  
  await page.fill('[name="email"]', 'user@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  
  await expect(page).toHaveURL('/')
  await expect(page.locator('.user-name')).toBeVisible()
})
```

---

## ✅ 检查清单

- [ ] 测试关键流程
- [ ] 等待元素加载
- [ ] 截图记录
- [ ] 独立测试数据

---

## 📚 相关技能

- `unit-test` - 单元测试