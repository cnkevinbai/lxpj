/**
 * 加载组件
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { Colors } from '../constants/Colors'
import { Styles } from '../constants/Styles'

@Component
export struct Loading {
  @Prop tip: string = '加载中...'
  @Prop size: 'small' | 'medium' | 'large' = 'medium'
  @Prop fullScreen: boolean = false

  build() {
    if (this.fullScreen) {
      Column() {
        this.buildContent()
      }
      .width('100%')
      .height('100%')
      .position({ x: 0, y: 0 })
      .backgroundColor('rgba(255, 255, 255, 0.8)')
      .justifyContent(FlexAlign.Center)
      .alignItems(HorizontalAlign.Center)
      .zIndex(9999)
    } else {
      this.buildContent()
    }
  }

  buildContent() {
    Column() {
      LoadingProgress()
        .width(this.getSize())
        .height(this.getSize())
        .color(Colors.PRIMARY)

      if (this.tip) {
        Text(this.tip)
          .fontSize(Styles.FONT_SIZE.sm)
          .fontColor(Colors.TEXT_SECONDARY)
          .margin({ top: 12 })
      }
    }
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
  }

  private getSize(): number {
    switch (this.size) {
      case 'small':
        return 24
      case 'large':
        return 48
      default:
        return 32
    }
  }
}
