# 单元测试技能

## 📋 技能说明

编写高质量的单元测试，确保代码质量。

---

## 🎯 适用场景

- 函数测试
- 模块测试
- 组件测试

---

## 📝 Jest 测试示例

```typescript
describe('UserService', () => {
  let service: UserService
  let mockRepo: MockType<Repository<User>>

  beforeEach(() => {
    mockRepo = createMockRepo()
    service = new UserService(mockRepo)
  })

  describe('create', () => {
    it('should create user successfully', async () => {
      // Arrange
      const dto = { email: 'test@example.com', name: 'Test' }
      mockRepo.create.mockReturnValue(dto)
      
      // Act
      const result = await service.create(dto)
      
      // Assert
      expect(result).toEqual(dto)
      expect(mockRepo.create).toHaveBeenCalledWith(dto)
    })
  })
})
```

---

## ✅ 检查清单

- [ ] 测试覆盖率高
- [ ] 边界情况测试
- [ ] Mock 外部依赖
- [ ] 测试独立运行

---

## 📚 相关技能

- `e2e-test` - E2E 测试