/**
 * 通用卡片组件
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { Colors } from '../constants/Colors'
import { Styles } from '../constants/Styles'

@Component
export struct Card {
  @Prop title: string = ''
  @Prop showArrow: boolean = false
  @Prop padding: number = Styles.SPACING.lg
  onClick: () => void = () => {}
  @BuilderParam extra: () => void = () => {}
  @BuilderParam header: () => void = () => {}
  @BuilderParam footer: () => void = () => {}

  build() {
    Column() {
      // 头部
      if (this.title || this.header) {
        Row() {
          if (this.header) {
            this.header()
          } else {
            Text(this.title)
              .fontSize(Styles.FONT_SIZE.lg)
              .fontWeight(Styles.FONT_WEIGHT.medium)
              .fontColor(Colors.TEXT_PRIMARY)

            Blank()

            if (this.extra) {
              this.extra()
            }

            if (this.showArrow) {
              Image($r('app.media.icon_arrow_right'))
                .width(16)
                .height(16)
            }
          }
        }
        .width('100%')
        .margin({ bottom: 12 })
      }

      // 内容
      Column() {
        ContentSlot()
      }
      .width('100%')

      // 底部
      if (this.footer) {
        Divider()
          .color(Colors.BORDER_LIGHT)
          .margin({ top: 12, bottom: 12 })

        Row() {
          this.footer()
        }
        .width('100%')
      }
    }
    .width('100%')
    .padding(this.padding)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(Styles.RADIUS.lg)
    .shadow(Styles.SHADOW.card)
    .onClick(() => {
      this.onClick()
    })
  }
}
