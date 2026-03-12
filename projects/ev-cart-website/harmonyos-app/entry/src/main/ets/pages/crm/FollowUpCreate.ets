/**
 * 创建跟进页
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { router } from '@kit.ArkRouter'
import { promptAction } from '@kit.ArkUI'
import { Colors } from '../../common/constants/Colors'
import { Styles } from '../../common/constants/Styles'

@Entry
@Component
struct FollowUpCreate {
  @State followUpType: string = 'phone'
  @State content: string = ''
  @State nextFollowUpDate: string = ''
  @State submitting: boolean = false

  build() {
    Column() {
      // 导航栏
      this.buildNavBar()

      // 表单内容
      Scroll() {
        Column() {
          // 跟进方式
          this.buildTypeSelector()

          // 跟进内容
          this.buildContentInput()

          // 下次跟进
          this.buildNextFollowUp()
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

      Text('添加跟进')
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

  // 跟进方式选择
  buildTypeSelector() {
    Column() {
      Text('跟进方式')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      Row() {
        this.buildTypeItem('phone', '电话')
        this.buildTypeItem('wechat', '微信')
        this.buildTypeItem('visit', '拜访')
        this.buildTypeItem('email', '邮件')
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

  // 跟进方式项
  buildTypeItem(type: string, label: string) {
    Column() {
      Text(this.getTypeIcon(type))
        .fontSize(24)
        .margin({ bottom: 4 })

      Text(label)
        .fontSize(12)
        .fontColor(this.followUpType === type ? Colors.PRIMARY : Colors.TEXT_SECONDARY)
    }
    .width('23%')
    .padding(12)
    .backgroundColor(this.followUpType === type ? Colors.PRIMARY_LIGHTER : Colors.BG_DISABLED)
    .borderRadius(8)
    .onClick(() => {
      this.followUpType = type
    })
  }

  // 跟进内容输入
  buildContentInput() {
    Column() {
      Text('跟进内容')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      TextArea({ text: this.content, placeholder: '请输入跟进内容...' })
        .fontSize(Styles.FONT_SIZE.md)
        .fontColor(Colors.TEXT_PRIMARY)
        .placeholderColor(Colors.TEXT_PLACEHOLDER)
        .backgroundColor(Colors.BG_DISABLED)
        .padding(12)
        .borderRadius(8)
        .height(120)
        .onChange((value: string) => {
          this.content = value
        })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 下次跟进日期
  buildNextFollowUp() {
    Column() {
      Text('下次跟进')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      Row() {
        Text(this.nextFollowUpDate || '选择日期')
          .fontSize(Styles.FONT_SIZE.md)
          .fontColor(this.nextFollowUpDate ? Colors.TEXT_PRIMARY : Colors.TEXT_PLACEHOLDER)
          .layoutWeight(1)

        Image($r('app.media.icon_calendar'))
          .width(20)
          .height(20)
          .fillColor(Colors.PRIMARY)
      }
      .width('100%')
      .height(48)
      .padding({ left: 16, right: 16 })
      .backgroundColor(Colors.BG_DISABLED)
      .borderRadius(8)
      .onClick(() => {
        // TODO: 打开日期选择器
        promptAction.showToast({ message: '打开日期选择器' })
      })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
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
        this.submitFollowUp()
      })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
  }

  private getTypeIcon(type: string): string {
    const map: Record<string, string> = {
      'phone': '📞',
      'wechat': '💬',
      'visit': '👥',
      'email': '📧'
    }
    return map[type] || type
  }

  private submitFollowUp() {
    if (!this.content) {
      promptAction.showToast({ message: '请输入跟进内容' })
      return
    }

    this.submitting = true
    // TODO: 调用 API 提交
    setTimeout(() => {
      this.submitting = false
      promptAction.showToast({ message: '提交成功' })
      router.back()
    }, 1000)
  }
}
