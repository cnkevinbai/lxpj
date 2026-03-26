/**
 * 道达智能 CRM+ERP 系统 - 后端 API 服务器
 * 技术栈：Node.js + Express + MongoDB
 * 版本：v1.0.0
 */

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 引入官网联动路由
const websiteRoutes = require('./routes/website')

// API 版本
const API_VERSION = '/api/v1'

// 使用官网联动路由
app.use(API_VERSION, websiteRoutes)

// ==================== 认证模块 ====================
app.post(`${API_VERSION}/auth/login`, (req, res) => {
  const { username, password } = req.body
  // TODO: 实现真实认证逻辑
  res.json({
    success: true,
    token: 'mock_jwt_token_xxxxx',
    user: {
      id: '1',
      username,
      name: '管理员',
      role: 'admin',
      avatar: '👨‍💼',
    },
  })
})

app.post(`${API_VERSION}/auth/logout`, (req, res) => {
  res.json({ success: true, message: '登出成功' })
})

// ==================== 客户管理 ====================
app.get(`${API_VERSION}/customers`, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', name: '某某物流公司', contact: '张经理', phone: '13800138000', level: 'A', status: 'active' },
      { id: '2', name: '某某科技公司', contact: '李总', phone: '13900139000', level: 'A', status: 'active' },
    ],
    total: 2,
  })
})

app.get(`${API_VERSION}/customers/:id`, (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.params.id,
      name: '某某物流公司',
      contact: '张经理',
      phone: '13800138000',
      email: 'zhang@example.com',
      address: '北京市朝阳区 xxx 路 xxx 号',
      level: 'A',
      status: 'active',
    },
  })
})

app.post(`${API_VERSION}/customers`, (req, res) => {
  res.json({ success: true, message: '创建客户成功', id: Date.now().toString() })
})

app.put(`${API_VERSION}/customers/:id`, (req, res) => {
  res.json({ success: true, message: '更新客户成功' })
})

app.delete(`${API_VERSION}/customers/:id`, (req, res) => {
  res.json({ success: true, message: '删除客户成功' })
})

// ==================== 销售管理 ====================
app.get(`${API_VERSION}/leads`, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', name: '张三', company: '某某公司', phone: '13800138000', status: 'new' },
    ],
    total: 1,
  })
})

app.get(`${API_VERSION}/opportunities`, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', name: '智能换电柜采购项目', customer: '某某物流公司', amount: 150000, stage: 'proposal' },
    ],
    total: 1,
  })
})

app.get(`${API_VERSION}/orders`, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', orderCode: 'ORD20260313001', customer: '某某物流公司', amount: 150000, status: 'processing' },
    ],
    total: 1,
  })
})

// ==================== 产品管理 ====================
app.get(`${API_VERSION}/products`, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', name: '智能换电柜 V3', code: 'P001', price: 15000, stock: 150, status: 'active' },
      { id: '2', name: '锂电池 48V', code: 'P002', price: 1200, stock: 500, status: 'active' },
    ],
    total: 2,
  })
})

// ==================== 生产管理 ====================
app.get(`${API_VERSION}/production/orders`, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', orderNo: 'PO20260313001', product: '智能换电柜 V3', quantity: 50, status: 'producing', progress: 45 },
    ],
    total: 1,
  })
})

app.post(`${API_VERSION}/production/orders`, (req, res) => {
  res.json({ success: true, message: '创建生产订单成功', id: Date.now().toString() })
})

// ==================== 质量管理 ====================
app.get(`${API_VERSION}/quality/checks`, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', product: '智能换电柜 V3', batchNo: 'B20260313001', passRate: 98.5, status: 'passed' },
    ],
    total: 1,
  })
})

app.post(`${API_VERSION}/quality/checks`, (req, res) => {
  res.json({ success: true, message: '创建质检记录成功', id: Date.now().toString() })
})

// ==================== 设备管理 ====================
app.get(`${API_VERSION}/equipment`, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', code: 'EQ001', name: 'SMT 贴片机', status: 'running', usageRate: 85, healthScore: 92 },
    ],
    total: 1,
  })
})

app.post(`${API_VERSION}/equipment`, (req, res) => {
  res.json({ success: true, message: '添加设备成功', id: Date.now().toString() })
})

// ==================== 财务管理 ====================
app.get(`${API_VERSION}/finance/statistics`, (req, res) => {
  res.json({
    success: true,
    data: {
      totalRevenue: 12685000,
      totalExpense: 8520000,
      netProfit: 4165000,
      receivables: 2350000,
      payables: 1280000,
    },
  })
})

app.get(`${API_VERSION}/finance/cashflow`, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', type: '销售收入', amount: 1580000, direction: 'in', date: '2026-03-13' },
      { id: '2', type: '采购支出', amount: 680000, direction: 'out', date: '2026-03-13' },
    ],
    total: 2,
  })
})

// ==================== 预算管理 ====================
app.get(`${API_VERSION}/budget`, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', department: '销售部', category: '营销费用', amount: 5000000, used: 3200000, usageRate: 64 },
    ],
    total: 1,
  })
})

app.post(`${API_VERSION}/budget`, (req, res) => {
  res.json({ success: true, message: '创建预算成功', id: Date.now().toString() })
})

// ==================== 人力资源 ====================
app.get(`${API_VERSION}/hr/employees`, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', name: '张三', department: '销售部', position: '销售经理', status: 'active' },
    ],
    total: 1,
  })
})

app.get(`${API_VERSION}/hr/training`, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', title: '新员工入职培训', date: '2026-03-15', participants: 25, status: 'planned' },
    ],
    total: 1,
  })
})

// ==================== 审批流 ====================
app.get(`${API_VERSION}/workflow/approvals`, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', title: '采购订单 PO20260313001', type: '采购审批', applicant: '张三', amount: 158000, status: 'pending' },
    ],
    total: 1,
  })
})

app.post(`${API_VERSION}/workflow/approvals/:id/approve`, (req, res) => {
  res.json({ success: true, message: '审批通过' })
})

app.post(`${API_VERSION}/workflow/approvals/:id/reject`, (req, res) => {
  res.json({ success: true, message: '已拒绝' })
})

// ==================== 钉钉集成 ====================
app.get(`${API_VERSION}/dingtalk/status`, (req, res) => {
  res.json({
    success: true,
    data: {
      connected: true,
      corpId: 'ding12345678',
      lastSync: '2026-03-13 09:00',
      syncedToday: 28,
    },
  })
})

app.post(`${API_VERSION}/dingtalk/sync`, (req, res) => {
  res.json({ success: true, message: '同步成功', synced: 28 })
})

// ==================== 鸿蒙 APP API ====================
app.get(`${API_VERSION}/harmony/app-info`, (req, res) => {
  res.json({
    success: true,
    data: {
      appName: '道达智能',
      version: '2.5.0',
      buildNumber: 20260313,
      minVersion: '2.0.0',
      downloadUrl: 'https://app.evcart.com/harmony.apk',
      updateLog: '1. 优化审批流体验\n2. 新增设备管理\n3. 修复已知问题',
    },
  })
})

app.get(`${API_VERSION}/harmony/dashboard`, (req, res) => {
  res.json({
    success: true,
    data: {
      stats: {
        pendingTasks: 12,
        pendingApprovals: 5,
        notifications: 8,
        keyCustomers: 3,
      },
      quickActions: [
        { id: '1', name: '完成工单', icon: 'check', count: 12 },
        { id: '2', name: '待跟进', icon: 'clock', count: 8 },
        { id: '3', name: '新通知', icon: 'bell', count: 5 },
        { id: '4', name: '重点客户', icon: 'star', count: 3 },
      ],
      recentActivities: [
        { time: '10:30', event: '完成了服务单 SV20260313001', user: '王师傅' },
        { time: '10:15', event: '新建客户 某某科技公司', user: '销售 A' },
      ],
    },
  })
})

// ==================== 报表中心 ====================
app.get(`${API_VERSION}/reports/sales`, (req, res) => {
  res.json({
    success: true,
    data: {
      totalRevenue: 12685000,
      totalOrders: 1458,
      newCustomers: 328,
      conversionRate: 68.5,
      trend: [
        { month: '1 月', revenue: 1200000, orders: 145 },
        { month: '2 月', revenue: 1320000, orders: 158 },
        { month: '3 月', revenue: 1010000, orders: 125 },
      ],
    },
  })
})

app.get(`${API_VERSION}/reports/production`, (req, res) => {
  res.json({
    success: true,
    data: {
      totalOrders: 48,
      completedOrders: 35,
      producingOrders: 10,
      avgOEE: 88,
    },
  })
})

// ==================== 系统设置 ====================
app.get(`${API_VERSION}/settings/company`, (req, res) => {
  res.json({
    success: true,
    data: {
      name: '道达智能',
      code: 'DDZN',
      address: '四川省眉山市',
      phone: '028-12345678',
      email: 'contact@evcart.com',
      website: 'https://www.evcart.com',
    },
  })
})

app.put(`${API_VERSION}/settings/company`, (req, res) => {
  res.json({ success: true, message: '保存成功' })
})

// ==================== 错误处理 ====================
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: '服务器内部错误',
    message: err.message,
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
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 道达智能 CRM+ERP API 服务器已启动                     ║
║                                                           ║
║   端口：${PORT}                                            
║   环境：${process.env.NODE_ENV || 'development'}                   
║   版本：v1.0.0                                            
║                                                           ║
║   API 文档：http://localhost:${PORT}/api-docs               
║   健康检查：http://localhost:${PORT}/health                 
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `)
})

module.exports = app
