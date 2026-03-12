// 客户列表页面
import { router } from '@ohos.router'
import { apiService } from '../common/services/ApiService'
import { ROUTES, COLORS, SPACING } from '../common/utils/Constants'
import { Customer } from '../common/models/Customer'

@Entry
@Component
struct Customers {
  @State customers: Customer[] = []
  @State loading: boolean = false
  @State refreshing: boolean = false
  @State searchText: string = ''
  @State page: number = 1
  @State total: number = 0

  aboutToAppear() {
    this.loadCustomers()
  }

  build() {
    Column() {
      // 顶部导航
      Row() {
        Text('客户管理')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#fff')
      }
      .width('100%')
      .height(56)
      .backgroundColor('#1890ff')
      .padding({ left: 16, right: 16 })
      .alignItems(VerticalAlign.Center)

      // 搜索栏
      Row() {
        TextInput({ placeholder: '搜索客户', text: this.searchText })
          .onChange((value) => this.searchText = value)
          .width('100%')
          .height(40)
          .backgroundColor('#fff')
          .borderRadius(20)
          .padding({ left: 16, right: 16 })
      }
      .width('100%')
      .padding(16)
      .backgroundColor('#fff')

      // 客户列表
      if (this.loading && this.customers.length === 0) {
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
      } else if (this.customers.length === 0) {
        Column() {
          Image($r('app.media.ic_empty'))
            .width(120)
            .height(120)
          Text('暂无客户')
            .fontSize(16)
            .fontColor(COLORS.TEXT_DISABLED)
            .margin({ top: 16 })
        }
        .width('100%')
        .flexGrow(1)
        .justifyContent(FlexAlign.Center)
      } else {
        List() {
          ForEach(this.customers, (customer: Customer) => {
            ListItem() {
              // 客户卡片
              Row() {
                // 头像
                Column() {
                  Text(customer.customerName.charAt(0))
                    .fontSize(24)
                    .fontWeight(FontWeight.Bold)
                    .fontColor('#fff')
                }
                .width(50)
                .height(50)
                .backgroundColor('#1890ff')
                .borderRadius(25)
                .justifyContent(FlexAlign.Center)

                // 客户信息
                Column() {
                  Row() {
                    Text(customer.customerName)
                      .fontSize(16)
                      .fontWeight(FontWeight.Bold)
                      .fontColor(COLORS.TEXT_PRIMARY)

                    Text(customer.level === 'A' ? 'A 级' : customer.level === 'B' ? 'B 级' : 'C 级')
                      .fontSize(12)
                      .padding({ left: 8, right: 8, top: 2, bottom: 2 })
                      .backgroundColor(customer.level === 'A' ? '#ff4d4f' : customer.level === 'B' ? '#1890ff' : '#d9d9d9')
                      .borderRadius(4)
                      .fontColor('#fff')
                      .margin({ left: 8 })
                  }

                  Row() {
                    Text('联系人：' + customer.contactPerson)
                      .fontSize(14)
                      .fontColor(COLORS.TEXT_SECONDARY)

                    Text(' | ')
                      .fontSize(14)
                      .fontColor(COLORS.TEXT_SECONDARY)

                    Text(customer.contactPhone)
                      .fontSize(14)
                      .fontColor(COLORS.TEXT_SECONDARY)
                  }
                  .margin({ top: 4 })

                  Row() {
                    Text('订单数：' + customer.totalOrders)
                      .fontSize(12)
                      .fontColor(COLORS.TEXT_DISABLED)

                    Text('  |  ')
                      .fontSize(12)
                      .fontColor(COLORS.TEXT_DISABLED)

                    Text('消费：¥' + customer.totalAmount.toLocaleString())
                      .fontSize(12)
                      .fontColor(COLORS.PRIMARY)
                  }
                  .margin({ top: 4 })
                }
                .margin({ left: 12 })
                .flexGrow(1)

                // 箭头
                Image($r('app.media.ic_arrow_right'))
                  .width(16)
                  .height(16)
              }
              .width('100%')
              .padding(16)
              .backgroundColor('#fff')
              .borderRadius(8)
              .onClick(() => {
                router.pushUrl({
                  url: ROUTES.CUSTOMER_DETAIL,
                  params: { customerId: customer.id },
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

      // 添加按钮
      Row() {
        Button() {
          Image($r('app.media.ic_add'))
            .width(24)
            .height(24)
            .fillColor('#fff')
        }
        .width(56)
        .height(56)
        .backgroundColor(COLORS.PRIMARY)
        .borderRadius(28)
        .shadowColor('rgba(0,0,0,0.3)')
        .shadowRadius(8)
        .shadowOffset({ width: 0, height: 4 })
        .onClick(() => {
          // 跳转到添加客户页面
        })
      }
      .position({ x: '80%', y: '85%' })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(COLORS.BACKGROUND)
  }

  // 加载客户列表
  async loadCustomers() {
    this.loading = true
    try {
      const result = await apiService.get<any>(`/customers?page=${this.page}&limit=20`)
      this.customers = result.data || []
      this.total = result.total || 0
    } catch (error) {
      console.error('Load customers failed:', error)
    } finally {
      this.loading = false
      this.refreshing = false
    }
  }

  // 加载更多
  async loadMore() {
    if (this.customers.length >= this.total) return
    this.page++
    try {
      const result = await apiService.get<any>(`/customers?page=${this.page}&limit=20`)
      this.customers = [...this.customers, ...(result.data || [])]
    } catch (error) {
      console.error('Load more failed:', error)
    }
  }

  // 刷新
  async refresh() {
    this.refreshing = true
    this.page = 1
    await this.loadCustomers()
  }
}
