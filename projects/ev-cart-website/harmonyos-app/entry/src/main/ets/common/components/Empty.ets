/**
 * 空状态组件
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { Colors } from '../constants/Colors'
import { Styles } from '../constants/Styles'

@Component
export struct Empty {
  @Prop image: Resource | null = null
  @Prop description: string = '暂无数据'
  @Prop actionText: string = ''
  onAction: () => void = () => {}

  build() {
    Column() {
      // 图片
      if (this.image) {
        Image(this.image)
          .width(120)
          .height(120)
          .margin({ bottom: 16 })
      } else {
        Text('📭')
          .fontSize(64)
          .margin({ bottom: 16 })
      }

      // 描述
      Text(this.description)
        .fontSize(Styles.FONT_SIZE.md)
        .fontColor(Colors.TEXT_SECONDARY)
        .margin({ bottom: 16 })

      // 操作按钮
      if (this.actionText) {
        Button({ label: this.actionText, type: 'primary' })
          .onClick(() => {
            this.onAction()
          })
      }
    }
    .width('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .padding(40)
  }
}
