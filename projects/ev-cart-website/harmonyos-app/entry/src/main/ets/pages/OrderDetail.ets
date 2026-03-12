// 订单详情页面
import { router } from '@ohos.router'
import { apiService } from '../common/services/ApiService'
import { ROUTES, COLORS, SPACING, ORDER_STATUS } from '../common/utils/Constants'
import { Order } from '../common/models/Customer'

@Entry
@Component
struct OrderDetail {
  @State order: Order | null = null
  @State loading: boolean = true
  @State orderId: string = ''

  aboutToAppear() {
    const params = router.getParams() as Record<string, string>
    this.orderId = params?.orderId || ''
    if (this.orderId) {
      this.loadOrder()
    }
  }

  build() {
    Column() {
      // 顶部导航
      Row() {
        Button() {
          Image($r('app.media.ic_back'))
            .width(24)
            .height(24)
            .fillColor('#fff')
        }
        .type(ButtonType.Capsule)
        .plain(true)
        .onClick(() => router.back())

        Text('订单详情')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#fff')
          .flexGrow(1)
          .textAlign(TextAlign.Center)
      }
      .width('100%')
      .height(56)
      .backgroundColor('#1890ff')
      .padding({ left: 16, right: 16 })
      .alignItems(VerticalAlign.Center)

      if (this.loading) {
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
      } else if (this.order) {
        Scroll() {
          Column() {
            // 订单状态卡片
            Column() {
              Text(this.order.orderCode)
                .fontSize(20)
                .fontWeight(FontWeight.Bold)
                .fontColor('#fff')
                .margin({ bottom: 16 })

              Text(ORDER_STATUS[this.order.status]?.label || this.order.status)
                .fontSize(16)
                .padding({ left: 16, right: 16, top: 8, bottom: 8 })
                .backgroundColor(ORDER_STATUS[this.order.status]?.color || '#d9d9d9')
                .borderRadius(4)
                .fontColor('#fff')

              Text('¥' + this.order.totalAmount.toLocaleString())
                .fontSize(32)
                .fontWeight(FontWeight.Bold)
                .fontColor('#fff')
                .margin({ top: 16 })

              Text(this.order.paymentStatus === 'paid' ? '已支付' : '未支付')
                .fontSize(14)
                .fontColor('rgba(255,255,255,0.8)')
                .margin({ top: 8 })
            }
            .width('100%')
            .padding({ top: 40, bottom: 40 })
            .backgroundColor('#1890ff')
            .alignItems(HorizontalAlign.Center)

            // 订单信息
            Column() {
              Text('订单信息')
                .fontSize(18)
                .fontWeight(FontWeight.Bold)
                .fontColor(COLORS.TEXT_PRIMARY)
                .width('100%')
                .margin({ bottom: 16 })

              this.InfoRow('订单编号', this.order.orderCode)
              this.InfoRow('客户名称', this.order.customerName)
              this.InfoRow('订单日期', new Date(this.order.orderDate).toLocaleDateString())
              this.InfoRow('订单金额', '¥' + this.order.totalAmount.toLocaleString())
              this.InfoRow('支付状态', this.order.paymentStatus === 'paid' ? '已支付' : '未支付')
            }
            .width('100%')
            .backgroundColor('#fff')
            .padding(16)
            .margin({ top: 16 })

            // 订单进度
            Text('订单进度')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor(COLORS.TEXT_PRIMARY)
              .width('100%')
              .padding({ left: 16, top: 16, bottom: 8 })

            Column() {
              this.ProgressItem('订单创建', true)
              this.ProgressItem('订单确认', this.order.status !== 'pending')
              this.ProgressItem('配货完成', this.order.status === 'processing' || this.order.status === 'completed')
              this.ProgressItem('订单发货', this.order.status === 'completed')
              this.ProgressItem('订单完成', this.order.status === 'completed')
            }
            .width('100%')
            .backgroundColor('#fff')
            .padding(16)
            .margin({ top: 12, left: 16, right: 16 })
          }
        }
        .width('100%')
        .flexGrow(1)
        .backgroundColor(COLORS.BACKGROUND)
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  InfoRow(label: string, value: string) {
    Row() {
      Text(label)
        .fontSize(14)
        .fontColor(COLORS.TEXT_SECONDARY)
        .width(100)

      Text(value)
        .fontSize(14)
        .fontWeight(FontWeight.Bold)
        .fontColor(COLORS.TEXT_PRIMARY)
        .flexGrow(1)
    }
    .width('100%')
    .padding({ top: 12, bottom: 12 })
  }

  @Builder
  ProgressItem(text: string, completed: boolean) {
    Row() {
      Column() {
        Circle()
          .width(12)
          .height(12)
          .fill(completed ? COLORS.SUCCESS : COLORS.BORDER)
      }
      .margin({ right: 12 })

      Text(text)
        .fontSize(14)
        .fontColor(completed ? COLORS.SUCCESS : COLORS.TEXT_DISABLED)
        .flexGrow(1)

      if (completed) {
        Text('✓')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor(COLORS.SUCCESS)
      }
    }
    .width('100%')
    .padding({ top: 12, bottom: 12 })
  }

  async loadOrder() {
    try {
      this.order = await apiService.get<Order>(`/orders/${this.orderId}`)
    } catch (error) {
      console.error('Load order failed:', error)
    } finally {
      this.loading = false
    }
  }
}
