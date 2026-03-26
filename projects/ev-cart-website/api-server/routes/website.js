/**
 * 官网 API 路由 - 处理官网与业务系统联动
 */

const express = require('express')
const router = express.Router()
const { sendApprovalNotification } = require('../middleware/notify')
const { checkInventory, createProductionPlan } = require('../middleware/inventory')

// ==================== 服务工单联动 ====================

/**
 * POST /api/v1/service/tickets
 * 创建服务工单 (官网服务支持页面提交)
 */
router.post('/service/tickets', async (req, res) => {
  try {
    const { name, phone, company, product, issue } = req.body

    // TODO: 调用售后服务系统 API 创建工单
    const ticket = {
      id: `SV${Date.now()}`,
      name,
      phone,
      company,
      product,
      issue,
      status: 'pending',
      source: '官网',
      createTime: new Date().toISOString(),
    }

    // TODO: 发送通知给客服团队
    // await notifyServiceTeam(ticket)

    res.json({
      success: true,
      message: '服务工单创建成功',
      data: ticket,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

/**
 * GET /api/v1/service/tickets/:id
 * 查询服务工单进度
 */
router.get('/service/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params

    // TODO: 从售后服务系统查询工单进度
    const ticket = {
      id,
      orderNo: id,
      status: 'processing',
      currentStep: 2,
      totalSteps: 5,
      assignee: '王师傅',
      updateTime: new Date().toISOString(),
      timeline: [
        { time: '2026-03-13 09:00', event: '工单创建', user: '系统' },
        { time: '2026-03-13 09:15', event: '客服受理', user: '客服 A' },
        { time: '2026-03-13 09:30', event: '派单给工程师', user: '调度员' },
      ],
    }

    res.json({
      success: true,
      data: ticket,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

/**
 * GET /api/v1/service/centers
 * 获取服务网点列表
 */
router.get('/service/centers', async (req, res) => {
  try {
    const { city } = req.query

    // TODO: 从渠道管理系统获取服务网点
    const centers = [
      { id: '1', city: '北京', address: '北京市朝阳区 xxx 路 xxx 号', phone: '010-88888888', lat: 39.9042, lng: 116.4074 },
      { id: '2', city: '上海', address: '上海市浦东新区 xxx 路 xxx 号', phone: '021-88888888', lat: 31.2304, lng: 121.4737 },
      { id: '3', city: '广州', address: '广州市天河区 xxx 路 xxx 号', phone: '020-88888888', lat: 23.1291, lng: 113.2644 },
      { id: '4', city: '深圳', address: '深圳市南山区 xxx 路 xxx 号', phone: '0755-88888888', lat: 22.5431, lng: 114.0579 },
      { id: '5', city: '杭州', address: '杭州市西湖区 xxx 路 xxx 号', phone: '0571-88888888', lat: 30.2741, lng: 120.1551 },
      { id: '6', city: '成都', address: '成都市高新区 xxx 路 xxx 号', phone: '028-88888888', lat: 30.5728, lng: 104.0668 },
      { id: '7', city: '武汉', address: '武汉市武昌区 xxx 路 xxx 号', phone: '027-88888888', lat: 30.5928, lng: 114.3055 },
      { id: '8', city: '西安', address: '西安市雁塔区 xxx 路 xxx 号', phone: '029-88888888', lat: 34.3416, lng: 108.9398 },
    ]

    res.json({
      success: true,
      data: centers,
      total: centers.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// ==================== CRM 线索联动 ====================

/**
 * POST /api/v1/leads
 * 创建线索 (官网商务合作/产品询价)
 */
router.post('/leads', async (req, res) => {
  try {
    const { name, company, phone, email, type, source, message, productId, quantity } = req.body

    // 如果是产品询价，检查库存
    let needProduction = false
    if (productId && quantity) {
      const inventoryCheck = await checkInventory(productId, quantity)
      if (!inventoryCheck.sufficient) {
        needProduction = true
        console.log(`⚠️ ${inventoryCheck.message}`)
      }
    }

    // 创建线索
    const lead = {
      id: `L${Date.now()}`,
      leadCode: `L${Date.now()}`,
      name,
      company,
      phone,
      email,
      type: type || '商务合作',
      source: source || '官网',
      message,
      productId,
      quantity,
      status: 'new',
      owner: '销售 A',
      createdAt: new Date().toISOString(),
    }

    // TODO: 调用 CRM 系统 API 保存线索

    // 如果需要生产，创建生产计划
    if (needProduction) {
      await createProductionPlan(productId, quantity)
    }

    // 发送通知给销售团队
    console.log(`📬 新线索：${name} (${company}) - ${type}`)
    // await notifySalesTeam(lead)

    res.json({
      success: true,
      message: '线索创建成功',
      data: lead,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

/**
 * POST /api/v1/inquiry
 * 产品询价
 */
router.post('/inquiry', async (req, res) => {
  try {
    const { name, phone, company, productId, productName, quantity, requirement } = req.body

    // 创建询价线索
    const lead = {
      id: `L${Date.now()}`,
      leadCode: `L${Date.now()}`,
      name,
      phone,
      company,
      type: '产品询价',
      source: '官网',
      productId,
      productName,
      quantity,
      requirement,
      status: 'new',
      createdAt: new Date().toISOString(),
    }

    res.json({
      success: true,
      message: '询价提交成功',
      data: lead,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// ==================== 经销商加盟联动 ====================

/**
 * POST /api/v1/dealers/apply
 * 提交加盟申请
 */
router.post('/dealers/apply', async (req, res) => {
  try {
    const { name, phone, company, city, investment, experience, message } = req.body

    // 创建加盟申请
    const application = {
      id: `DA${Date.now()}`,
      applicationNo: `DA${Date.now()}`,
      name,
      phone,
      company,
      city,
      investment,
      experience,
      message,
      status: 'pending',
      currentStep: 1,
      totalSteps: 6,
      source: '官网',
      submitTime: new Date().toISOString(),
    }

    // TODO: 调用渠道管理系统 API 保存申请

    // 发送通知给招商团队
    console.log(`📬 新加盟申请：${application.name} (${application.phone}) - ${city}`)
    // await notifyDealerTeam(application)

    res.json({
      success: true,
      message: '加盟申请提交成功',
      data: application,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

/**
 * PUT /api/v1/dealers/application/:id/status
 * 更新申请状态 (审核通过/拒绝时调用)
 */
router.put('/dealers/application/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status, reason } = req.body

    // TODO: 更新渠道管理系统中的申请状态

    // 发送通知给申请人
    const application = { id, phone: req.body.phone, status, applicationNo: id }
    await sendApprovalNotification(application)

    res.json({
      success: true,
      message: '状态更新成功',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

/**
 * GET /api/v1/dealers/policy
 * 获取加盟政策
 */
router.get('/dealers/policy', async (req, res) => {
  try {
    // TODO: 从渠道管理系统获取加盟政策
    const policy = {
      conditions: [
        '认同道达智能品牌理念',
        '具备一定的资金实力 (50 万起)',
        '有相关行业经验者优先',
        '有良好的商业信誉',
        '愿意接受总部统一管理',
        '有固定经营场所',
      ],
      investment: {
        franchiseFee: 50000,
        deposit: 30000,
        initialStock: 200000,
        decoration: '50000-100000',
        workingCapital: 100000,
        total: '50-100 万',
      },
      benefits: {
        productMargin: '30-40%',
        serviceMargin: '50-60%',
        partsMargin: '40-50%',
        annualSales: '300-500 万',
        annualProfit: '80-150 万',
        paybackPeriod: '12-18 个月',
      },
      protection: {
        county: '5km',
        city: '10km',
        policy: '严格的区域保护政策',
      },
    }

    res.json({
      success: true,
      data: policy,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

/**
 * GET /api/v1/dealers/regions
 * 查询区域状态
 */
router.get('/dealers/regions', async (req, res) => {
  try {
    const { city } = req.query

    // TODO: 从渠道管理系统查询区域保护状态
    const regions = [
      { city: '北京', status: 'available', dealers: 5 },
      { city: '上海', status: 'limited', dealers: 8 },
      { city: '广州', status: 'available', dealers: 3 },
      { city: '深圳', status: 'limited', dealers: 7 },
      { city: '杭州', status: 'available', dealers: 2 },
      { city: '成都', status: 'available', dealers: 4 },
    ]

    res.json({
      success: true,
      data: regions,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

/**
 * GET /api/v1/dealers/application/:id
 * 查询申请进度
 */
router.get('/dealers/application/:id', async (req, res) => {
  try {
    const { id } = req.params

    // TODO: 从渠道管理系统查询申请进度
    const application = {
      id,
      name: '张三',
      phone: '13800138000',
      city: '北京',
      status: '审核中',
      currentStep: 2,
      totalSteps: 6,
      timeline: [
        { step: 1, name: '提交申请', time: '2026-03-13 09:00', status: 'completed' },
        { step: 2, name: '资质审核', time: '2026-03-13 10:00', status: 'processing' },
        { step: 3, name: '电话面试', time: '-', status: 'waiting' },
        { step: 4, name: '签约合作', time: '-', status: 'waiting' },
        { step: 5, name: '培训学习', time: '-', status: 'waiting' },
        { step: 6, name: '开业运营', time: '-', status: 'waiting' },
      ],
    }

    res.json({
      success: true,
      data: application,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// ==================== 产品数据联动 ====================

/**
 * GET /api/v1/products
 * 获取产品列表 (官网展示)
 */
router.get('/products', async (req, res) => {
  try {
    const { category } = req.query

    // TODO: 从 CRM 产品管理获取产品列表
    const products = [
      { id: '1', code: 'P001', name: '智能换电柜 V3', category: '换电设备', price: 15000, stock: 150, status: 'active', hot: true },
      { id: '2', code: 'P002', name: '智能换电柜 V2', category: '换电设备', price: 12000, stock: 200, status: 'active', hot: false },
      { id: '3', code: 'P003', name: '锂电池 48V', category: '锂电池', price: 1200, stock: 500, status: 'active', hot: true },
      { id: '4', code: 'P004', name: '锂电池 60V', category: '锂电池', price: 1800, stock: 300, status: 'active', hot: false },
      { id: '5', code: 'P005', name: '智能管理系统', category: '软件系统', price: 9800, stock: 999, status: 'active', hot: true },
      { id: '6', code: 'P006', name: '配件包', category: '配件', price: 150, stock: 1000, status: 'active', hot: false },
    ]

    res.json({
      success: true,
      data: products,
      total: products.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

/**
 * GET /api/v1/products/:id
 * 获取产品详情
 */
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params

    // TODO: 从 CRM 产品管理获取产品详情
    const product = {
      id,
      code: 'P001',
      name: '智能换电柜 V3',
      category: '换电设备',
      description: '第三代智能换电设备，支持 20 块电池同时充换',
      price: 15000,
      stock: 150,
      status: 'active',
      features: ['AI 智能识别', '5G 物联网', '模块化设计', '智能调度'],
      specs: {
        尺寸：'2000×1200×600mm',
        重量：'500kg',
        电池容量：'20 块',
        功率：'50kW',
      },
      images: [
        '/images/products/p001-1.jpg',
        '/images/products/p001-2.jpg',
        '/images/products/p001-3.jpg',
      ],
    }

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

module.exports = router
