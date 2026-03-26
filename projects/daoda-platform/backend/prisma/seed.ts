/**
 * 数据库种子脚本
 * 初始化测试数据：管理员用户、测试客户、产品等
 */
import { PrismaClient, UserRole, UserStatus, CustomerLevel, CustomerStatus, ProductStatus, OrderStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始种子数据初始化...')

  // 1. 创建管理员用户
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@daoda.com' },
    update: {},
    create: {
      email: 'admin@daoda.com',
      phone: '13800138000',
      password: adminPassword,
      name: '系统管理员',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  })
  console.log('✅ 创建管理员用户:', admin.email)

  // 2. 创建测试员工
  const staffPassword = await bcrypt.hash('staff123', 10)
  const staff = await prisma.user.upsert({
    where: { email: 'staff@daoda.com' },
    update: {},
    create: {
      email: 'staff@daoda.com',
      phone: '13800138001',
      password: staffPassword,
      name: '张三',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    },
  })
  console.log('✅ 创建员工用户:', staff.email)

  // 3. 创建测试客户
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { id: 'customer-1' },
      update: {},
      create: {
        id: 'customer-1',
        name: '北京科技有限公司',
        contact: '李经理',
        phone: '13900000001',
        email: 'li@beijing-tech.com',
        address: '北京市朝阳区建国路88号',
        level: CustomerLevel.A,
        status: CustomerStatus.ACTIVE,
        source: '展会',
        industry: '互联网',
        province: '北京',
        city: '北京市',
        userId: admin.id,
      },
    }),
    prisma.customer.upsert({
      where: { id: 'customer-2' },
      update: {},
      create: {
        id: 'customer-2',
        name: '上海智能制造有限公司',
        contact: '王总',
        phone: '13900000002',
        email: 'wang@shanghai-smart.com',
        address: '上海市浦东新区张江路100号',
        level: CustomerLevel.A,
        status: CustomerStatus.ACTIVE,
        source: '转介绍',
        industry: '制造业',
        province: '上海',
        city: '上海市',
        userId: staff.id,
      },
    }),
    prisma.customer.upsert({
      where: { id: 'customer-3' },
      update: {},
      create: {
        id: 'customer-3',
        name: '广州新能源科技有限公司',
        contact: '陈经理',
        phone: '13900000003',
        email: 'chen@guangzhou-energy.com',
        address: '广州市天河区天河路200号',
        level: CustomerLevel.B,
        status: CustomerStatus.ACTIVE,
        source: '线上',
        industry: '新能源',
        province: '广东',
        city: '广州市',
        userId: admin.id,
      },
    }),
  ])
  console.log('✅ 创建测试客户:', customers.length, '个')

  // 4. 创建测试产品
  const products = await Promise.all([
    prisma.product.upsert({
      where: { code: 'DD-001' },
      update: {},
      create: {
        name: '道达智能终端 V1.0',
        code: 'DD-001',
        category: '智能终端',
        series: 'V系列',
        price: 2999.00,
        description: '高性能车载智能终端，支持4G/5G通信',
        status: ProductStatus.ACTIVE,
      },
    }),
    prisma.product.upsert({
      where: { code: 'DD-002' },
      update: {},
      create: {
        name: '道达监控平台 标准版',
        code: 'DD-002',
        category: '软件平台',
        series: '标准版',
        price: 9999.00,
        description: '车辆监控管理平台，支持实时定位、轨迹回放',
        status: ProductStatus.ACTIVE,
      },
    }),
    prisma.product.upsert({
      where: { code: 'DD-003' },
      update: {},
      create: {
        name: '道达智能网关',
        code: 'DD-003',
        category: '网关设备',
        series: 'G系列',
        price: 1599.00,
        description: '车载智能网关，支持多协议转换',
        status: ProductStatus.ACTIVE,
      },
    }),
  ])
  console.log('✅ 创建测试产品:', products.length, '个')

  // 5. 创建测试订单
  const order = await prisma.order.upsert({
    where: { id: 'order-1' },
    update: {},
    create: {
      id: 'order-1',
      orderNo: 'DD202603210001',
      status: OrderStatus.COMPLETED,
      totalAmount: 29990.00,
      customerId: customers[0].id,
      userId: admin.id,
    },
  })
  console.log('✅ 创建测试订单:', order.orderNo)

  // 6. 创建订单明细
  await prisma.orderItem.upsert({
    where: { id: 'order-item-1' },
    update: {},
    create: {
      id: 'order-item-1',
      quantity: 10,
      unitPrice: 2999.00,
      totalPrice: 29990.00,
      orderId: order.id,
      productId: products[0].id,
    },
  })
  console.log('✅ 创建订单明细')

  console.log('\n🎉 种子数据初始化完成！')
  console.log('\n📋 测试账号信息:')
  console.log('   管理员: admin@daoda.com / admin123')
  console.log('   员工:   staff@daoda.com / staff123')
}

main()
  .catch((e) => {
    console.error('❌ 种子数据初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })