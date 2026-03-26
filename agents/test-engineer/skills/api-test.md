# API 测试技能

## 📋 技能说明

对 API 接口进行自动化测试。

---

## 🎯 适用场景

- 接口测试
- 性能测试
- 契约测试

---

## 📝 测试示例

```typescript
describe('User API', () => {
  it('GET /users should return list', async () => {
    const res = await request(app).get('/api/v1/users')
    
    expect(res.status).toBe(200)
    expect(res.body.data).toBeInstanceOf(Array)
  })

  it('POST /users should create user', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ email: 'test@example.com', name: 'Test' })
    
    expect(res.status).toBe(201)
    expect(res.body.data.id).toBeDefined()
  })
})
```

---

## ✅ 检查清单

- [ ] 覆盖所有接口
- [ ] 测试异常情况
- [ ] 验证响应格式
- [ ] 测试权限控制

---

## 📚 相关技能

- `unit-test` - 单元测试