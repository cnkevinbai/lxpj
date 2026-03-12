/**
 * 骨架屏组件
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { Colors } from '../constants/Colors'

@Component
export struct Skeleton {
  @Prop rows: number = 3
  @Prop avatar: boolean = false
  @Prop title: boolean = false
  @Prop animated: boolean = true

  build() {
    Column() {
      if (this.avatar || this.title) {
        Row() {
          if (this.avatar) {
            Rectangle()
              .width(40)
              .height(40)
              .fillColor(Colors.BG_DISABLED)
              .borderRadius(20)
          }

          if (this.title) {
            Rectangle()
              .width('60%')
              .height(16)
              .fillColor(Colors.BG_DISABLED)
              .borderRadius(4)
              .margin({ left: 12 })
          }
        }
        .width('100%')
        .margin({ bottom: 12 })
      }

      ForEach(Array.from({ length: this.rows }), (_, index: number) => {
        Rectangle()
          .width(index === this.rows - 1 ? '40%' : '100%')
          .height(12)
          .fillColor(Colors.BG_DISABLED)
          .borderRadius(4)
          .margin({ bottom: 8 })
      })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(8)
  }
}
