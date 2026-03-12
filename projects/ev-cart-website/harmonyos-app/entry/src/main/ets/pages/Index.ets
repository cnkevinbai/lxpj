// 鸿蒙 APP 首页
import { router } from '@ohos.router'
import { apiService } from '../common/services/ApiService'
import { ROUTES, COLORS, SPACING } from '../common/utils/Constants'
import { DashboardStats, QuickAction } from '../common/models/Customer'
import { TabBar } from '../common/components/TabBar'

@Entry
@Component
struct Index {
  @State stats: DashboardStats = {
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingTasks: 0,
  }
  @State loading: boolean = false

  aboutToAppear() {
    this.loadStats()
  }

  build() {
    Column() {
      // 顶部导航
      Row() {
        Text('EV Cart')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#fff')
      }
      .width('100%')
      .height(56)
      .backgroundColor('#1890ff')
      .padding({ left: 16, right: 16 })
      .alignItems(VerticalAlign.Center)

      Scroll() {
        Column() {
          // 数据统计卡片
          Row() {
            // 客户数
            Column() {
              Text(this.stats.totalCustomers)
                .fontSize(24)
                .fontWeight(FontWeight.Bold)
                .fontColor(COLORS.PRIMARY)
              Text('客户')
                .fontSize(12)
                .fontColor(COLORS.TEXT_SECONDARY)
                .margin({ top: 4 })
            }
            .width('25%')
            .alignItems(HorizontalAlign.Center)

            // 订单数
            Column() {
              Text(this.stats.totalOrders)
                .fontSize(24)
                .fontWeight(FontWeight.Bold)
                .fontColor(COLORS.SUCCESS)
              Text('订单')
                .fontSize(12)
                .fontColor(COLORS.TEXT_SECONDARY)
                .margin({ top: 4 })
            }
            .width('25%')
            .alignItems(HorizontalAlign.Center)

            // 收入
            Column() {
              Text('¥' + (this.stats.totalRevenue / 10000).toFixed(1) + '万')
                .fontSize(18)
                .fontWeight(FontWeight.Bold)
                .fontColor(COLORS.WARNING)
              Text('收入')
                .fontSize(12)
                .fontColor(COLORS.TEXT_SECONDARY)
                .margin({ top: 4 })
            }
            .width('25%')
            .alignItems(HorizontalAlign.Center)

            // 待办
            Column() {
              Text(this.stats.pendingTasks)
                .fontSize(24)
                .fontWeight(FontWeight.Bold)
                .fontColor(COLORS.ERROR)
              Text('待办')
                .fontSize(12)
                .fontColor(COLORS.TEXT_SECONDARY)
                .margin({ top: 4 })
            }
            .width('25%')
            .alignItems(HorizontalAlign.Center)
          }
          .width('100%')
          .padding(16)
          .backgroundColor('#fff')

          // 快捷功能
          Text('快捷功能')
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor(COLORS.TEXT_PRIMARY)
            .width('100%')
            .padding({ left: 16, top: 16, bottom: 8 })

          Row() {
            this.QuickActionCard('客户管理', $r('app.media.ic_customer'), '#52c41a', () => {
              router.pushUrl({ url: ROUTES.CUSTOMERS })
            })

            this.QuickActionCard('订单管理', $r('app.media.ic_order'), '#faad14', () => {
              router.pushUrl({ url: ROUTES.ORDERS })
            })
          }
          .width('100%')
          .padding({ left: 16, right: 16 })

          Row() {
            this.QuickActionCard('库存查询', $r('app.media.ic_inventory'), '#722ed1', () => {
              router.pushUrl({ url: ROUTES.INVENTORY })
            })

            this.QuickActionCard('财务报表', $r('app.media.ic_finance'), '#13c2c2', () => {
              router.pushUrl({ url: ROUTES.FINANCE })
            })
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 12 })

          // 待办事项
          Text('待办事项')
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor(COLORS.TEXT_PRIMARY)
            .width('100%')
            .padding({ left: 16, top: 16, bottom: 8 })

          Column() {
            Text('暂无待办事项')
              .fontSize(14)
              .fontColor(COLORS.TEXT_DISABLED)
              .padding(32)
          }
          .width('100%')
          .backgroundColor('#fff')
          .margin({ left: 16, right: 16 })
          .borderRadius(8)
        }
      }
      .width('100%')
      .flexGrow(1)
      .backgroundColor(COLORS.BACKGROUND)

      // 底部导航
      TabBar({ currentIndex: 0 })
    }
    .width('100%')
    .height('100%')
  }

  // 快捷功能卡片
  @Builder
  QuickActionCard(title: string, icon: Resource, color: string, onClick: () => void) {
    Column() {
      Image(icon)
        .width(40)
        .height(40)
        .margin({ bottom: 8 })

      Text(title)
        .fontSize(14)
        .fontColor(COLORS.TEXT_PRIMARY)
    }
    .width('45%')
    .height(100)
    .backgroundColor('#fff')
    .borderRadius(8)
    .justifyContent(FlexAlign.Center)
    .onClick(onClick)
  }

  // 加载统计数据
  async loadStats() {
    this.loading = true
    try {
      const result = await apiService.get<DashboardStats>('/dashboard')
      this.stats = result
    } catch (error) {
      console.error('Load stats failed:', error)
    } finally {
      this.loading = false
    }
  }
}
