// 客户卡片组件
import { Customer } from '../models/Customer'
import { COLORS, CUSTOMER_LEVELS } from '../utils/Constants'

@Component
export struct CustomerCard {
  @Prop customer: Customer
  onClick?: () => void

  build() {
    Row() {
      // 头像
      Column() {
        Text(this.customer.customerName.charAt(0))
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
          Text(this.customer.customerName)
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor(COLORS.TEXT_PRIMARY)

          // 客户级别
          Text(CUSTOMER_LEVELS[this.customer.level]?.label || '')
            .fontSize(12)
            .padding({ left: 8, right: 8, top: 2, bottom: 2 })
            .backgroundColor(CUSTOMER_LEVELS[this.customer.level]?.color || '#d9d9d9')
            .borderRadius(4)
            .fontColor('#fff')
            .margin({ left: 8 })
        }

        Row() {
          Text('联系人：' + this.customer.contactPerson)
            .fontSize(14)
            .fontColor(COLORS.TEXT_SECONDARY)

          Text(' | ')
            .fontSize(14)
            .fontColor(COLORS.TEXT_SECONDARY)

          Text(this.customer.contactPhone)
            .fontSize(14)
            .fontColor(COLORS.TEXT_SECONDARY)
        }
        .margin({ top: 4 })

        Row() {
          Text('订单数：' + this.customer.totalOrders)
            .fontSize(12)
            .fontColor(COLORS.TEXT_DISABLED)

          Text('  |  ')
            .fontSize(12)
            .fontColor(COLORS.TEXT_DISABLED)

          Text('消费：¥' + this.customer.totalAmount.toLocaleString())
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
    .margin({ bottom: 12 })
    .onClick(() => {
      if (this.onClick) {
        this.onClick()
      }
    })
  }
}
