/**
 * 创建工单页
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { router } from '@kit.ArkRouter'
import { promptAction } from '@kit.ArkUI'
import { Colors } from '../../common/constants/Colors'
import { Styles } from '../../common/constants/Styles'

@Entry
@Component
struct TicketCreate {
  @State ticketType: string = 'repair'
  @State priority: string = 'normal'
  @State customerName: string = ''
  @State customerPhone: string = ''
  @State productName: string = ''
  @State problemDescription: string = ''
  @State serviceAddress: string = ''
  @State submitting: boolean = false

  build() {
    Column() {
      // 导航栏
      this.buildNavBar()

      // 表单内容
      Scroll() {
        Column() {
          // 工单类型
          this.buildTypeSelector()

          // 优先级
          this.buildPrioritySelector()

          // 客户信息
          this.buildCustomerInfo()

          // 产品信息
          this.buildProductInfo()

          // 问题描述
          this.buildProblemInput()

          // 服务地址
          this.buildAddressInput()
        }
        .width('100%')
        .padding(16)
      }
      .scrollable(ScrollDirection.Vertical)
      .layoutWeight(1)

      // 提交按钮
      this.buildSubmitButton()
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Colors.BG_PAGE)
  }

  // 导航栏
  buildNavBar() {
    Row() {
      Image($r('app.media.icon_back'))
        .width(24)
        .height(24)
        .onClick(() => {
          router.back()
        })

      Text('创建工单')
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .margin({ left: 16 })

      Blank()
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
    .backgroundColor(Colors.BG_CARD)
  }

  // 工单类型选择
  buildTypeSelector() {
    Column() {
      Text('工单类型')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      Row() {
        this.buildTypeItem('repair', '维修', '🔧')
        this.buildTypeItem('installation', '安装', '📦')
        this.buildTypeItem('maintenance', '保养', '⚙️')
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 工单类型项
  buildTypeItem(type: string, label: string, icon: string) {
    Column() {
      Text(icon)
        .fontSize(24)
        .margin({ bottom: 4 })

      Text(label)
        .fontSize(12)
        .fontColor(this.ticketType === type ? Colors.PRIMARY : Colors.TEXT_SECONDARY)
    }
    .width('31%')
    .padding(12)
    .backgroundColor(this.ticketType === type ? Colors.PRIMARY_LIGHTER : Colors.BG_DISABLED)
    .borderRadius(8)
    .onClick(() => {
      this.ticketType = type
    })
  }

  // 优先级选择
  buildPrioritySelector() {
    Column() {
      Text('优先级')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      Row() {
        this.buildPriorityItem('normal', '普通', Colors.SUCCESS)
        this.buildPriorityItem('urgent', '紧急', Colors.WARNING)
        this.buildPriorityItem('critical', '特急', Colors.ERROR)
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 优先级项
  buildPriorityItem(priority: string, label: string, color: string) {
    Column() {
      Text(label)
        .fontSize(12)
        .fontColor(this.priority === priority ? color : Colors.TEXT_SECONDARY)
    }
    .width('31%')
    .padding(12)
    .backgroundColor(this.priority === priority ? color + '20' : Colors.BG_DISABLED)
    .borderRadius(8)
    .onClick(() => {
      this.priority = priority
    })
  }

  // 客户信息
  buildCustomerInfo() {
    Column() {
      Text('客户信息')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      Input({
        value: $customerName,
        placeholder: '客户姓名'
      })
      .margin({ bottom: 12 })

      Input({
        value: $customerPhone,
        placeholder: '联系电话',
        type: 'phone'
      })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 产品信息
  buildProductInfo() {
    Column() {
      Text('产品信息')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      Input({
        value: $productName,
        placeholder: '产品名称'
      })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 问题描述
  buildProblemInput() {
    Column() {
      Text('问题描述')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      TextArea({ text: $problemDescription, placeholder: '请详细描述问题...' })
        .fontSize(Styles.FONT_SIZE.md)
        .fontColor(Colors.TEXT_PRIMARY)
        .placeholderColor(Colors.TEXT_PLACEHOLDER)
        .backgroundColor(Colors.BG_DISABLED)
        .padding(12)
        .borderRadius(8)
        .height(120)
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 服务地址
  buildAddressInput() {
    Column() {
      Text('服务地址')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      TextArea({ text: $serviceAddress, placeholder: '请输入详细服务地址' })
        .fontSize(Styles.FONT_SIZE.md)
        .fontColor(Colors.TEXT_PRIMARY)
        .placeholderColor(Colors.TEXT_PLACEHOLDER)
        .backgroundColor(Colors.BG_DISABLED)
        .padding(12)
        .borderRadius(8)
        .height(80)
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 提交按钮
  buildSubmitButton() {
    Row() {
      Button({
        label: '提交',
        type: 'primary',
        size: 'large',
        block: true,
        loading: this.submitting
      })
      .onClick(() => {
        this.submitTicket()
      })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
  }

  private submitTicket() {
    // 验证必填项
    if (!this.customerName || !this.customerPhone || !this.productName || !this.problemDescription) {
      promptAction.showToast({ message: '请填写必填项' })
      return
    }

    this.submitting = true
    // TODO: 调用 API 提交
    setTimeout(() => {
      this.submitting = false
      promptAction.showToast({ message: '创建成功' })
      router.back()
    }, 1000)
  }
}
