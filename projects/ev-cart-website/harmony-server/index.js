/**
 * 道达智能 - 鸿蒙 APP 后端服务器
 * 技术栈：Node.js + Express + WebSocket
 * 版本：v1.0.0
 */

const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server, port: 3001 })

const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())

// API 版本
const API_VERSION = '/api/v1/harmony'

// 连接的设备
const connectedDevices = new Map()

// WebSocket 连接处理
wss.on('connection', (ws) => {
  const deviceId = `device_${Date.now()}`
  connectedDevices.set(deviceId, ws)

  console.log(`📱 设备连接：${deviceId} (当前在线：${connectedDevices.size})`)

  // 发送欢迎消息
  ws.send(JSON.stringify({
    type: 'welcome',
    deviceId,
    message: '欢迎使用道达智能鸿蒙版',
  }))

  // 接收消息
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message)
      console.log(`📨 收到消息：${deviceId}`, data)

      // 广播消息给其他设备
      connectedDevices.forEach((client, id) => {
        if (id !== deviceId && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'notification',
            from: deviceId,
            data,
          }))
        }
      })
    } catch (error) {
      console.error('消息解析错误:', error)
    }
  })

  // 断开连接
  ws.on('close', () => {
    connectedDevices.delete(deviceId)
    console.log(`📴 设备断开：${deviceId} (当前在线：${connectedDevices.size})`)
  })
})

// ==================== 鸿蒙 APP API ====================

// APP 信息
app.get(`${API_VERSION}/app-info`, (req, res) => {
  res.json({
    success: true,
    data: {
      appName: '道达智能',
      version: '2.5.0',
      buildNumber: 20260313,
      minVersion: '2.0.0',
      downloadUrl: 'https://app.evcart.com/harmony.apk',
      updateLog: [
        '1. 优化审批流体验',
        '2. 新增设备管理',
        '3. 修复已知问题',
      ],
      features: [
        '移动办公',
        '审批流',
        '数据看板',
        '消息通知',
        '扫码功能',
      ],
    },
  })
})

// 移动工作台数据
app.get(`${API_VERSION}/dashboard`, (req, res) => {
  res.json({
    success: true,
    data: {
      stats: {
        pendingTasks: 12,
        pendingApprovals: 5,
        notifications: 8,
        keyCustomers: 3,
        todaySales: 458000,
        todayOrders: 28,
        newCustomers: 5,
      },
      quickActions: [
        { id: '1', name: '完成工单', icon: 'check_circle', count: 12, color: '#52c41a' },
        { id: '2', name: '待跟进', icon: 'schedule', count: 8, color: '#faad14' },
        { id: '3', name: '新通知', icon: 'notifications', count: 5, color: '#1890ff' },
        { id: '4', name: '重点客户', icon: 'star', count: 3, color: '#722ed1' },
      ],
      recentActivities: [
        { time: '10:30', event: '完成了服务单 SV20260313001', user: '王师傅', type: 'service' },
        { time: '10:15', event: '新建客户 某某科技公司', user: '销售 A', type: 'customer' },
        { time: '09:50', event: '提交了订单 ORD20260313001', user: '销售 B', type: 'order' },
        { time: '09:30', event: '处理了客户投诉', user: '客服 A', type: 'service' },
        { time: '09:00', event: '开始了今日工作', user: '系统', type: 'system' },
      ],
      topProducts: [
        { name: '智能换电柜 V3', sales: 350, revenue: 525, trend: 'up' },
        { name: '锂电池 48V', sales: 1200, revenue: 144, trend: 'up' },
        { name: '智能换电柜 V2', sales: 180, revenue: 216, trend: 'down' },
      ],
    },
  })
})

// 审批列表
app.get(`${API_VERSION}/approvals`, (req, res) => {
  res.json({
    success: true,
    data: {
      pending: [
        { id: '1', title: '采购订单 PO20260313001', applicant: '张三', amount: 158000, time: '10 分钟前' },
        { id: '2', title: '费用报销 - 差旅费', applicant: '李四', amount: 5800, time: '30 分钟前' },
      ],
      handled: [
        { id: '3', title: '合同审批 - 某某物流', applicant: '王五', amount: 500000, status: 'approved', time: '昨天' },
      ],
    },
  })
})

// 审批操作
app.post(`${API_VERSION}/approvals/:id/approve`, (req, res) => {
  const { id } = req.params
  const { comment } = req.body

  // 广播审批结果
  broadcastNotification({
    type: 'approval_result',
    approvalId: id,
    action: 'approved',
    comment,
    time: new Date().toISOString(),
  })

  res.json({ success: true, message: '审批通过' })
})

app.post(`${API_VERSION}/approvals/:id/reject`, (req, res) => {
  const { id } = req.params
  const { reason } = req.body

  // 广播审批结果
  broadcastNotification({
    type: 'approval_result',
    approvalId: id,
    action: 'rejected',
    reason,
    time: new Date().toISOString(),
  })

  res.json({ success: true, message: '已拒绝' })
})

// 消息通知
app.get(`${API_VERSION}/notifications`, (req, res) => {
  res.json({
    success: true,
    data: {
      unread: 8,
      list: [
        { id: '1', type: 'approval', title: '新的审批待处理', content: '采购订单 PO20260313001 待您审批', time: '10 分钟前', read: false },
        { id: '2', type: 'task', title: '新任务分配', content: '您有新的服务工单需要处理', time: '30 分钟前', read: false },
        { id: '3', type: 'system', title: '系统通知', content: '系统将于今晚 22:00 进行维护', time: '1 小时前', read: true },
      ],
    },
  })
})

app.post(`${API_VERSION}/notifications/read`, (req, res) => {
  const { ids } = req.body
  res.json({ success: true, message: `已标记 ${ids.length} 条通知为已读` })
})

// 客户管理
app.get(`${API_VERSION}/customers`, (req, res) => {
  res.json({
    success: true,
    data: {
      total: 328,
      list: [
        { id: '1', name: '某某物流公司', contact: '张经理', phone: '13800138000', level: 'A' },
        { id: '2', name: '某某科技公司', contact: '李总', phone: '13900139000', level: 'A' },
      ],
    },
  })
})

// 服务工单
app.get(`${API_VERSION}/service-tickets`, (req, res) => {
  res.json({
    success: true,
    data: {
      pending: 5,
      processing: 8,
      completed: 125,
      list: [
        { id: '1', orderNo: 'SV20260313001', customer: '某某物流公司', status: 'pending', time: '10 分钟前' },
        { id: '2', orderNo: 'SV20260313002', customer: '某某科技公司', status: 'processing', time: '30 分钟前' },
      ],
    },
  })
})

// 扫码功能
app.post(`${API_VERSION}/scan`, (req, res) => {
  const { code, type } = req.body

  res.json({
    success: true,
    data: {
      code,
      type,
      result: {
        productId: 'P001',
        productName: '智能换电柜 V3',
        batchNo: 'B20260313001',
        producedAt: '2026-03-10',
      },
    },
  })
})

// 文件上传
app.post(`${API_VERSION}/upload`, (req, res) => {
  res.json({
    success: true,
    data: {
      url: 'https://cdn.evcart.com/uploads/20260313/xxx.jpg',
      filename: 'image.jpg',
      size: 1024000,
    },
  })
})

// 推送通知
function broadcastNotification(data) {
  const message = JSON.stringify({
    type: 'push_notification',
    data,
    timestamp: new Date().toISOString(),
  })

  connectedDevices.forEach((client, deviceId) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })

  console.log(`📢 推送通知：${connectedDevices.size} 个设备`)
}

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    connectedDevices: connectedDevices.size,
  })
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '接口不存在',
    path: req.path,
  })
})

// 启动服务器
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🌸 道达智能 鸿蒙 APP 服务器已启动                        ║
║                                                           ║
║   HTTP 端口：${PORT}                                        
║   WebSocket 端口：3001                                     
║   环境：${process.env.NODE_ENV || 'development'}                   
║   版本：v1.0.0                                            
║                                                           ║
║   健康检查：http://localhost:${PORT}/health                 
║   WebSocket: ws://localhost:3001                          
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `)
})

module.exports = { app, server, wss }
