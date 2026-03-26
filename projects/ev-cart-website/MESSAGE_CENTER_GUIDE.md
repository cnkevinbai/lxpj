# 消息中心系统指南

**版本**: 1.0  
**更新时间**: 2026-03-14  
**状态**: ✅ 生产就绪

---

## 📊 系统概览

道达智能消息中心是企业统一通知平台，整合站内信、邮件、短信、WhatsApp 等多种通知渠道，实现全系统消息的统一管理和推送。

### 核心能力
- ✅ 站内消息 (系统通知、待办提醒)
- ✅ 邮件通知 (工作邮件、系统通知)
- ✅ 短信通知 (重要提醒、验证码)
- ✅ WhatsApp 集成 (海外客户沟通)
- ✅ 消息分类 (系统、业务、审批、通知)
- ✅ 消息推送 (实时推送、定时推送)
- ✅ 消息模板 (可配置模板)
- ✅ 消息统计 (送达率、阅读率)

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                  消息前端 (React + Vite)                     │
│  /message-center  /notifications  /settings                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API / WebSocket
                              │
┌─────────────────────────────────────────────────────────────┐
│                  消息后端模块 (NestJS)                       │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │ message  │notification│  email   │   sms    │whatsapp  │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  Redis   │  │  Email   │  │   SMS    │
        │  Pub/Sub │  │  Server  │  │ Gateway  │
        └──────────┘  └──────────┘  └──────────┘
```

---

## 📦 模块详解

### 1. 站内消息 (In-App Messages)

**路径**: `/message-center`  
**后端**: `backend/src/modules/message/`

#### 消息类型
| 类型 | 说明 | 示例 |
|------|------|------|
| 系统通知 | 系统级通知 | 系统维护、版本更新 |
| 业务提醒 | 业务流程提醒 | 订单审核、库存预警 |
| 审批通知 | 审批流程通知 | 待审批、审批结果 |
| 任务分配 | 任务分配通知 | 新任务、任务截止 |
| 日程提醒 | 日程相关提醒 | 会议提醒、生日提醒 |

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| 消息列表 | 按分类展示消息 | ✅ |
| 消息详情 | 查看消息详细内容 | ✅ |
| 消息标记 | 已读/未读标记 | ✅ |
| 消息删除 | 删除消息 | ✅ |
| 消息置顶 | 重要消息置顶 | ✅ |
| 消息搜索 | 按关键词搜索 | ✅ |
| 批量操作 | 批量已读、批量删除 | ✅ |

#### 消息结构
```typescript
interface Message {
  id: string;
  type: 'system' | 'business' | 'approval' | 'task' | 'schedule';
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isRead: boolean;
  isPinned: boolean;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  receiver: {
    id: string;
    name: string;
  };
  relatedEntity?: {
    type: 'order' | 'customer' | 'approval' | 'task';
    id: string;
    url: string;
  };
  createdAt: Date;
  readAt?: Date;
}
```

---

### 2. 通知中心 (Notification Center)

**路径**: `/notifications`  
**后端**: `backend/src/modules/notification/`

#### 通知渠道
| 渠道 | 说明 | 状态 |
|------|------|------|
| 站内通知 | 浏览器内通知 | ✅ |
| 邮件通知 | 发送邮件 | ✅ |
| 短信通知 | 发送短信 | ✅ |
| WhatsApp | WhatsApp 消息 | ✅ |
| 推送通知 | 浏览器 Push | ⏳ |
| APP 推送 | 移动端推送 | ⏳ |

#### 通知触发器
| 触发器 | 说明 | 示例 |
|--------|------|------|
| 订单创建 | 新订单创建时 | 销售收到新订单通知 |
| 订单审核 | 订单审核状态变更 | 客户收到审核结果 |
| 库存预警 | 库存低于安全库存 | 采购收到补货提醒 |
| 审批待办 | 有待审批事项 | 审批人收到待办通知 |
| 任务分配 | 新任务分配 | 执行人收到任务通知 |
| 日程提醒 | 日程即将开始 | 参会人收到会议提醒 |
| 生日提醒 | 员工/客户生日 | 生日祝福通知 |

#### 通知设置
```
┌─────────────────────────────────────────────────────────────┐
│                    通知设置                                  │
├─────────────────────────────────────────────────────────────┤
│  订单通知                                                   │
│  ☑ 新订单创建    [站内] [邮件] [短信] [ ]                  │
│  ☑ 订单审核结果  [站内] [邮件] [ ] [ ]                     │
│  ☑ 订单发货      [站内] [邮件] [ ] [ ]                     │
├─────────────────────────────────────────────────────────────┤
│  审批通知                                                   │
│  ☑ 待审批事项    [站内] [邮件] [短信] [ ]                  │
│  ☑ 审批结果      [站内] [邮件] [ ] [ ]                     │
├─────────────────────────────────────────────────────────────┤
│  库存通知                                                   │
│  ☑ 库存预警      [站内] [邮件] [短信] [ ]                  │
│  ☑ 库存盘点提醒  [站内] [邮件] [ ] [ ]                     │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. 邮件通知 (Email Notification)

**路径**: 系统设置 → 邮件配置  
**后端**: `backend/src/modules/email/`

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| 邮件发送 | 发送通知邮件 | ✅ |
| 邮件模板 | 可配置邮件模板 | ✅ |
| 邮件群发 | 批量发送邮件 | ✅ |
| 邮件追踪 | 发送状态追踪 | ✅ |
| 邮件日志 | 发送记录日志 | ✅ |

#### 邮件模板
```html
<!-- 订单确认邮件模板 -->
<html>
<body>
  <h1>订单确认</h1>
  <p>尊敬的 {{customerName}}：</p>
  <p>您的订单 {{orderNumber}} 已确认。</p>
  <table>
    <tr><td>订单金额：</td><td>{{amount}}</td></tr>
    <tr><td>预计交货：</td><td>{{deliveryDate}}</td></tr>
  </table>
  <p>感谢您的订购！</p>
</body>
</html>
```

#### 邮件配置
```yaml
email:
  provider: smtp
  host: smtp.company.com
  port: 587
  secure: true
  auth:
    user: notifications@company.com
    pass: ${EMAIL_PASSWORD}
  from:
    name: 道达智能
    email: notifications@company.com
```

---

### 4. 短信通知 (SMS Notification)

**路径**: 系统设置 → 短信配置  
**后端**: `backend/src/modules/sms/`

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| 短信发送 | 发送通知短信 | ✅ |
| 短信模板 | 可配置短信模板 | ✅ |
| 验证码 | 短信验证码 | ✅ |
| 发送记录 | 发送日志记录 | ✅ |
| 费用统计 | 短信费用统计 | ✅ |

#### 短信模板
```
【道达智能】您的订单{orderNumber}已发货，
快递单号：{trackingNumber}，请注意查收。

【道达智能】您有一条待审批事项，
审批类型：{approvalType}，请及时处理。
```

#### 短信服务商
| 服务商 | 适用地区 | 状态 |
|--------|----------|------|
| 阿里云短信 | 中国大陆 | ✅ |
| 腾讯云短信 | 中国大陆 | ✅ |
| Twilio | 国际 | ✅ |
| AWS SNS | 国际 | ✅ |

---

### 5. WhatsApp 集成 (WhatsApp Integration)

**路径**: 系统设置 → WhatsApp 配置  
**后端**: `backend/src/modules/whatsapp/`

#### 核心功能
| 功能 | 说明 | 状态 |
|------|------|------|
| 消息发送 | 发送 WhatsApp 消息 | ✅ |
| 模板消息 | WhatsApp 模板消息 | ✅ |
| 会话管理 | 客户会话管理 | ✅ |
| 消息记录 | 消息历史记录 | ✅ |

#### 使用场景
- 海外客户订单通知
- 海外客户物流跟踪
- 海外客户售后服务
- 国际团队内部沟通

#### WhatsApp 消息模板
```
Hello {{customer_name}},

Your order {{order_number}} has been shipped.
Tracking number: {{tracking_number}}

Track your order: {{tracking_url}}

Best regards,
Daoda Intelligent
```

---

### 6. 消息模板管理 (Message Templates)

**路径**: 系统设置 → 消息模板  
**后端**: `backend/src/modules/message/`

#### 模板类型
| 类型 | 说明 | 示例 |
|------|------|------|
| 订单模板 | 订单相关通知 | 订单确认、发货通知 |
| 审批模板 | 审批流程通知 | 待审批、审批结果 |
| 财务模板 | 财务相关通知 | 收款通知、付款提醒 |
| 库存模板 | 库存相关通知 | 库存预警、盘点提醒 |
| 系统模板 | 系统通知 | 系统维护、版本更新 |

#### 模板变量
```
订单确认模板:
  {{customerName}} - 客户名称
  {{orderNumber}} - 订单编号
  {{orderDate}} - 订单日期
  {{amount}} - 订单金额
  {{deliveryDate}} - 预计交货日期
  {{items}} - 产品清单

审批通知模板:
  {{applicantName}} - 申请人
  {{approvalType}} - 审批类型
  {{applyDate}} - 申请日期
  {{approvalUrl}} - 审批链接
```

---

## 🔄 消息推送流程

### 实时推送 (WebSocket)
```
事件触发 → 消息生成 → 消息队列 → WebSocket 推送 → 客户端接收
```

### 定时推送
```
定时任务 → 扫描待发送消息 → 消息队列 → 渠道发送 → 发送记录
```

### 批量推送
```
批量选择 → 消息模板 → 变量填充 → 消息队列 → 渠道发送 → 发送统计
```

---

## 📈 关键指标 (KPI)

| 指标 | 公式 | 目标值 |
|------|------|--------|
| 消息送达率 | 成功送达数 / 发送总数 | ≥ 99% |
| 消息阅读率 | 已读数 / 送达数 | ≥ 80% |
| 邮件打开率 | 打开数 / 发送数 | ≥ 30% |
| 短信送达率 | 成功送达数 / 发送数 | ≥ 95% |
| 平均响应时间 | 消息生成到推送时间 | ≤ 1 秒 |

---

## 🔧 技术实现

### 数据表结构
```sql
-- 消息表
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  type VARCHAR(20),
  title VARCHAR(200),
  content TEXT,
  priority VARCHAR(20),
  is_read BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  sender_id UUID,
  receiver_id UUID,
  related_entity_type VARCHAR(50),
  related_entity_id UUID,
  created_at TIMESTAMP,
  read_at TIMESTAMP
);

-- 通知配置表
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY,
  user_id UUID,
  event_type VARCHAR(50),
  channel_in_app BOOLEAN DEFAULT TRUE,
  channel_email BOOLEAN DEFAULT FALSE,
  channel_sms BOOLEAN DEFAULT FALSE,
  channel_whatsapp BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 消息模板表
CREATE TABLE message_templates (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  type VARCHAR(50),
  channel VARCHAR(20),
  subject VARCHAR(200),
  content TEXT,
  variables JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 发送日志表
CREATE TABLE message_logs (
  id UUID PRIMARY KEY,
  message_id UUID,
  channel VARCHAR(20),
  recipient VARCHAR(100),
  status VARCHAR(20),
  error_message TEXT,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP
);
```

### WebSocket 推送
```typescript
// 服务端
@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  async sendNotification(userId: string, message: Message) {
    this.server.to(`user:${userId}`).emit('notification', message);
  }
}

// 客户端
const socket = io('ws://api.company.com');
socket.on('notification', (message) => {
  // 处理通知
  showNotification(message);
});
```

---

## 📚 相关文档

- [AI_CHAT_INTEGRATION.md](./AI_CHAT_INTEGRATION.md)
- [SYSTEM_INTEGRATION_AUDIT.md](./SYSTEM_INTEGRATION_AUDIT.md)

---

## 🚀 待开发功能

| 功能模块 | 优先级 | 预计完成 |
|---------|--------|---------|
| 浏览器 Push | 中 | 2026-03-25 |
| APP 推送 | 中 | 2026-03-30 |
| 消息撤回 | 低 | 2026-04-05 |
| 消息定时发送 | 低 | 2026-04-10 |

---

**最后更新**: 2026-03-14  
**下次审查**: 2026-03-21  
**维护人**: 渔晓白 ⚙️
