// 客户详情页面
import { router } from '@ohos.router'
import { apiService } from '../common/services/ApiService'
import { ROUTES, COLORS, SPACING, CUSTOMER_LEVELS } from '../common/utils/Constants'
import { Customer, Order } from '../common/models/Customer'

@Entry
@Component
struct CustomerDetail {
  @State customer: Customer | null = null
  @State orders: Order[] = []
  @State loading: boolean = true
  @State customerId: string = ''

  aboutToAppear() {
    const params = router.getParams() as Record<string, string>
    this.customerId = params?.customerId || ''
    if (this.customerId) {
      this.loadCustomer()
      this.loadOrders()
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

        Text('客户详情')
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
      } else if (this.customer) {
        Scroll() {
          Column() {
            // 客户信息卡片
            Column() {
              // 头像
              Column() {
                Text(this.customer.customerName.charAt(0))
                  .fontSize(36)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('#fff')
              }
              .width(80)
              .height(80)
              .backgroundColor('#1890ff')
              .borderRadius(40)
              .justifyContent(FlexAlign.Center)

              // 客户名称
              Text(this.customer.customerName)
                .fontSize(24)
                .fontWeight(FontWeight.Bold)
                .fontColor('#fff')
                .margin({ top: 16 })

              // 客户级别
              Text(CUSTOMER_LEVELS[this.customer.level]?.label || '')
                .fontSize(14)
                .padding({ left: 12, right: 12, top: 4, bottom: 4 })
                .backgroundColor(CUSTOMER_LEVELS[this.customer.level]?.color || '#d9d9d9')
                .borderRadius(4)
                .fontColor('#fff')
                .margin({ top: 8 })
            }
            .width('100%')
            .padding({ top: 40, bottom: 40 })
            .backgroundColor('#1890ff')
            .alignItems(HorizontalAlign.Center)

            // 详细信息
            Column() {
              this.InfoRow('联系人', this.customer.contactPerson)
              this.InfoRow('联系电话', this.customer.contactPhone)
              this.InfoRow('联系邮箱', this.customer.contactEmail)
              this.InfoRow('所在区域', `${this.customer.province}·${this.customer.city}`)
              this.InfoRow('订单总数', this.customer.totalOrders.toString())
              this.InfoRow('消费总额', `¥${this.customer.totalAmount.toLocaleString()}`)
            }
            .width('100%')
            .backgroundColor('#fff')
            .padding(16)

            // 订单记录
            Text('订单记录')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor(COLORS.TEXT_PRIMARY)
              .width('100%')
              .padding({ left: 16, top: 16, bottom: 8 })

            if (this.orders.length === 0) {
              Column() {
                Text('暂无订单记录')
                  .fontSize(14)
                  .fontColor(COLORS.TEXT_DISABLED)
                  .padding(32)
              }
              .width('100%')
              .backgroundColor('#fff')
              .margin({ left: 16, right: 16 })
              .borderRadius(8)
            } else {
              Column() {
                ForEach(this.orders.slice(0, 5), (order: Order) => {
                  Column() {
                    Row() {
                      Text(order.orderCode)
                        .fontSize(16)
                        .fontWeight(FontWeight.Bold)
                      Text(order.status)
                        .fontSize(12)
                        .padding({ left: 8, right: 8 })
                        .backgroundColor('#1890ff')
                        .borderRadius(4)
                        .fontColor('#fff')
                    }
                    .width('100%')

                    Row() {
                      Text('¥' + order.totalAmount.toLocaleString())
                        .fontSize(18)
                        .fontWeight(FontWeight.Bold)
                        .fontColor(COLORS.PRIMARY)
                      Text(order.paymentStatus === 'paid' ? '已支付' : '未支付')
                        .fontSize(12)
                        .fontColor(COLORS.TEXT_SECONDARY)
                        .margin({ left: 8 })
                    }
                    .width('100%')
                    .margin({ top: 8 })
                  }
                  .width('100%')
                  .padding(16)
                  .backgroundColor('#fff')
                  .borderRadius(8)
                  .margin({ bottom: 12 })
                })
              }
              .width('100%')
              .padding({ left: 16, right: 16 })
            }
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

  async loadCustomer() {
    try {
      this.customer = await apiService.get<Customer>(`/customers/${this.customerId}`)
    } catch (error) {
      console.error('Load customer failed:', error)
    } finally {
      this.loading = false
    }
  }

  async loadOrders() {
    try {
      const result = await apiService.get<any>(`/orders?customerId=${this.customerId}&limit=5`)
      this.orders = result.data || []
    } catch (error) {
      console.error('Load orders failed:', error)
    }
  }
}
