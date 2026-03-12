// 订单列表页面
import { router } from '@ohos.router'
import { apiService } from '../common/services/ApiService'
import { ROUTES, COLORS, SPACING, ORDER_STATUS } from '../common/utils/Constants'
import { Order } from '../common/models/Customer'

@Entry
@Component
struct Orders {
  @State orders: Order[] = []
  @State loading: boolean = false
  @State refreshing: boolean = false
  @State page: number = 1
  @State total: number = 0
  @State filterStatus: string = ''

  aboutToAppear() {
    this.loadOrders()
  }

  build() {
    Column() {
      // 顶部导航
      Row() {
        Text('订单管理')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#fff')
      }
      .width('100%')
      .height(56)
      .backgroundColor('#1890ff')
      .padding({ left: 16, right: 16 })
      .alignItems(VerticalAlign.Center)

      // 状态筛选
      Row() {
        ForEach(['全部', '待处理', '处理中', '已完成', '已取消'], (status: string) => {
          Text(status)
            .fontSize(14)
            .padding({ left: 16, right: 16, top: 8, bottom: 8 })
            .backgroundColor(status === '全部' || status === this.filterStatus ? '#1890ff' : '#f5f5f5')
            .fontColor(status === '全部' || status === this.filterStatus ? '#fff' : COLORS.TEXT_PRIMARY)
            .borderRadius(16)
            .margin({ right: 8 })
            .onClick(() => {
              this.filterStatus = status
              this.loadOrders()
            })
        })
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 16, bottom: 8 })
      .backgroundColor('#fff')

      // 订单列表
      if (this.loading && this.orders.length === 0) {
        Column() {
          LoadingProgress()
            .width(40)
            .height(40)
          Text('加载中...')
            .fontSize(14)
            .fontColor(COLORS.TEXT_SECONDARY)
            .margin({ top: 16 })
        }
        .width('100%')
        .flexGrow(1)
        .justifyContent(FlexAlign.Center)
      } else if (this.orders.length === 0) {
        Column() {
          Image($r('app.media.ic_empty'))
            .width(120)
            .height(120)
          Text('暂无订单')
            .fontSize(16)
            .fontColor(COLORS.TEXT_DISABLED)
            .margin({ top: 16 })
        }
        .width('100%')
        .flexGrow(1)
        .justifyContent(FlexAlign.Center)
      } else {
        List() {
          ForEach(this.orders, (order: Order) => {
            ListItem() {
              Column() {
                // 订单头部
                Row() {
                  Text(order.orderCode)
                    .fontSize(16)
                    .fontWeight(FontWeight.Bold)
                    .fontColor(COLORS.TEXT_PRIMARY)

                  Text(ORDER_STATUS[order.status]?.label || order.status)
                    .fontSize(12)
                    .padding({ left: 8, right: 8, top: 2, bottom: 2 })
                    .backgroundColor(ORDER_STATUS[order.status]?.color || '#d9d9d9')
                    .borderRadius(4)
                    .fontColor('#fff')
                }
                .width('100%')

                // 订单信息
                Row() {
                  Text(order.customerName)
                    .fontSize(14)
                    .fontColor(COLORS.TEXT_SECONDARY)

                  Text(' | ')
                    .fontSize(14)
                    .fontColor(COLORS.TEXT_SECONDARY)

                  Text(new Date(order.orderDate).toLocaleDateString())
                    .fontSize(14)
                    .fontColor(COLORS.TEXT_SECONDARY)
                }
                .width('100%')
                .margin({ top: 8 })

                // 订单金额和支付状态
                Row() {
                  Text('¥' + order.totalAmount.toLocaleString())
                    .fontSize(18)
                    .fontWeight(FontWeight.Bold)
                    .fontColor(COLORS.PRIMARY)

                  Text(order.paymentStatus === 'paid' ? '已支付' : '未支付')
                    .fontSize(12)
                    .fontColor(order.paymentStatus === 'paid' ? COLORS.SUCCESS : COLORS.WARNING)
                    .margin({ left: 8 })
                }
                .width('100%')
                .margin({ top: 8 })
                .justifyContent(FlexAlign.SpaceBetween)
              }
              .width('100%')
              .padding(16)
              .backgroundColor('#fff')
              .borderRadius(8)
              .onClick(() => {
                router.pushUrl({
                  url: ROUTES.ORDER_DETAIL,
                  params: { orderId: order.id },
                })
              })
            }
            .margin({ bottom: 12 })
          })
        }
        .width('100%')
        .padding(16)
        .backgroundColor(COLORS.BACKGROUND)
        .flexGrow(1)
        .onReachBottom(() => this.loadMore())
        .refreshing({ refreshing: this.refreshing })
        .onRefresh(() => this.refresh())
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(COLORS.BACKGROUND)
  }

  // 加载订单列表
  async loadOrders() {
    this.loading = true
    try {
      const result = await apiService.get<any>(`/orders?page=${this.page}&limit=20&status=${this.filterStatus}`)
      this.orders = result.data || []
      this.total = result.total || 0
    } catch (error) {
      console.error('Load orders failed:', error)
    } finally {
      this.loading = false
      this.refreshing = false
    }
  }

  // 加载更多
  async loadMore() {
    if (this.orders.length >= this.total) return
    this.page++
    try {
      const result = await apiService.get<any>(`/orders?page=${this.page}&limit=20`)
      this.orders = [...this.orders, ...(result.data || [])]
    } catch (error) {
      console.error('Load more failed:', error)
    }
  }

  // 刷新
  async refresh() {
    this.refreshing = true
    this.page = 1
    await this.loadOrders()
  }
}
