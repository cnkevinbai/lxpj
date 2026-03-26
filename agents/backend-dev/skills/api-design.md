# API 设计技能（强化版）

## 📋 技能说明

基于 OpenAPI 3.1 规范设计 RESTful API，确保接口一致性和可维护性。

---

## 🎯 OpenAPI 3.1 规范

### 基础结构

```yaml
openapi: 3.1.0
info:
  title: API 名称
  description: API 描述
  version: 1.0.0
  contact:
    name: API Support
    email: support@example.com

servers:
  - url: https://api.example.com/v1
    description: 生产环境
  - url: https://api-staging.example.com/v1
    description: 测试环境

tags:
  - name: users
    description: 用户管理
  - name: orders
    description: 订单管理
```

---

## 📝 路径设计

### RESTful URL 规范

```yaml
paths:
  # 资源集合
  /users:
    get:
      tags: [users]
      summary: 获取用户列表
      operationId: getUsers
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/PageSizeParam'
        - name: status
          in: query
          schema:
            type: string
            enum: [active, inactive]
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
    
    post:
      tags: [users]
      summary: 创建用户
      operationId: createUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: 创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          $ref: '#/components/responses/Conflict'

  # 单个资源
  /users/{userId}:
    parameters:
      - $ref: '#/components/parameters/UserIdParam'
    
    get:
      tags: [users]
      summary: 获取用户详情
      operationId: getUser
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '404':
          $ref: '#/components/responses/NotFound'
    
    put:
      tags: [users]
      summary: 更新用户
      operationId: updateUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateUserRequest'
      responses:
        '200':
          description: 更新成功
    
    delete:
      tags: [users]
      summary: 删除用户
      operationId: deleteUser
      responses:
        '204':
          description: 删除成功
```

---

## 📝 组件定义

### Schemas

```yaml
components:
  schemas:
    # 基础模型
    User:
      type: object
      required:
        - id
        - email
        - name
      properties:
        id:
          type: string
          format: uuid
          example: '123e4567-e89b-12d3-a456-426614174000'
        email:
          type: string
          format: email
          example: 'user@example.com'
        name:
          type: string
          minLength: 2
          maxLength: 50
          example: '张三'
        avatar:
          type: string
          format: uri
          nullable: true
        status:
          type: string
          enum: [active, inactive]
          default: active
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
    
    # 请求模型
    CreateUserRequest:
      type: object
      required:
        - email
        - name
        - password
      properties:
        email:
          type: string
          format: email
        name:
          type: string
          minLength: 2
          maxLength: 50
        password:
          type: string
          format: password
          minLength: 8
    
    # 响应模型
    UserResponse:
      type: object
      required:
        - code
        - data
      properties:
        code:
          type: integer
          example: 0
        message:
          type: string
          example: success
        data:
          $ref: '#/components/schemas/User'
    
    # 分页响应
    UserListResponse:
      type: object
      properties:
        code:
          type: integer
        data:
          type: object
          properties:
            items:
              type: array
              items:
                $ref: '#/components/schemas/User'
            total:
              type: integer
            page:
              type: integer
            pageSize:
              type: integer
```

### Parameters

```yaml
components:
  parameters:
    UserIdParam:
      name: userId
      in: path
      required: true
      schema:
        type: string
        format: uuid
      description: 用户ID
    
    PageParam:
      name: page
      in: query
      schema:
        type: integer
        minimum: 1
        default: 1
      description: 页码
    
    PageSizeParam:
      name: pageSize
      in: query
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20
      description: 每页数量
```

### Responses

```yaml
components:
  responses:
    BadRequest:
      description: 请求参数错误
      content:
        application/json:
          schema:
            type: object
            properties:
              code:
                type: integer
                example: 40001
              message:
                type: string
                example: 参数错误
              errors:
                type: array
                items:
                  type: object
                  properties:
                    field:
                      type: string
                    message:
                      type: string
    
    NotFound:
      description: 资源不存在
      content:
        application/json:
          schema:
            type: object
            properties:
              code:
                type: integer
                example: 40401
              message:
                type: string
                example: 资源不存在
```

---

## ✅ API 设计检查清单

### URL 设计

- [ ] 使用小写和连字符
- [ ] 资源使用名词复数
- [ ] 版本号在 URL 中
- [ ] 避免深层嵌套

### 请求设计

- [ ] 参数验证完整
- [ ] 默认值合理
- [ ] 必填项明确

### 响应设计

- [ ] 统一响应格式
- [ ] 错误码有明确定义
- [ ] 包含请求 ID

### 文档

- [ ] Swagger/OpenAPI 文档完整
- [ ] 示例值真实可用
- [ ] 错误码说明

---

## 📚 参考资源

- [OpenAPI 3.1 规范](https://swagger.io/specification/)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [Google API Design Guide](https://cloud.google.com/apis/design)

---

## 📚 相关技能

- `nestjs-api` - NestJS API 开发
- `api-architecture` - API 架构设计