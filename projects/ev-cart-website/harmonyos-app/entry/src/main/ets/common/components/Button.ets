/**
 * 通用按钮组件
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { Colors } from '../constants/Colors'
import { Styles } from '../constants/Styles'

@Component
export struct Button {
  @Prop label: string = '按钮'
  @Prop type: 'primary' | 'default' | 'danger' = 'primary'
  @Prop size: 'small' | 'medium' | 'large' = 'medium'
  @Prop disabled: boolean = false
  @Prop loading: boolean = false
  @Prop icon: Resource | null = null
  @Prop block: boolean = false
  onClick: () => void = () => {}

  build() {
    Row() {
      if (this.loading) {
        LoadingProgress()
          .width(16)
          .height(16)
          .color(Colors.TEXT_PRIMARY)
          .margin({ right: 8 })
      } else if (this.icon) {
        Image(this.icon)
          .width(16)
          .height(16)
          .margin({ right: 8 })
      }

      Text(this.label)
        .fontSize(this.getFontSize())
        .fontWeight(Styles.FONT_WEIGHT.medium)
        .fontColor(this.getFontColor())
    }
    .justifyContent(FlexAlign.Center)
    .width(this.block ? '100%' : 'auto')
    .height(this.getHeight())
    .padding({ left: 16, right: 16 })
    .backgroundColor(this.getBackgroundColor())
    .borderRadius(Styles.RADIUS.full)
    .opacity(this.disabled ? 0.5 : 1)
    .onClick(() => {
      if (!this.disabled && !this.loading) {
        this.onClick()
      }
    })
  }

  private getHeight(): number {
    switch (this.size) {
      case 'small':
        return 32
      case 'large':
        return 56
      default:
        return 48
    }
  }

  private getFontSize(): number {
    switch (this.size) {
      case 'small':
        return 12
      case 'large':
        return 18
      default:
        return 16
    }
  }

  private getBackgroundColor(): ResourceColor {
    if (this.disabled) {
      return Colors.BG_DISABLED
    }

    switch (this.type) {
      case 'primary':
        return Colors.PRIMARY
      case 'danger':
        return Colors.ERROR
      default:
        return Colors.BG_CARD
    }
  }

  private getFontColor(): ResourceColor {
    if (this.disabled) {
      return Colors.TEXT_PLACEHOLDER
    }

    switch (this.type) {
      case 'default':
        return Colors.PRIMARY
      default:
        return '#FFFFFF'
    }
  }
}
