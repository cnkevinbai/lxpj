/**
 * 多行文本输入组件
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { Colors } from '../../common/constants/Colors'
import { Styles } from '../../common/constants/Styles'

@Component
export struct TextArea {
  @Link text: string
  @Prop placeholder: string = '请输入'
  @Prop maxLength: number = 0
  @Prop disabled: boolean = false
  onFocus: () => void = () => {}
  onBlur: () => void = () => {}
  onInput: (value: string) => void = () => {}

  build() {
    TextInput({ text: this.text, placeholder: this.placeholder })
      .type(InputType.Text)
      .fontSize(Styles.FONT_SIZE.md)
      .fontColor(Colors.TEXT_PRIMARY)
      .placeholderColor(Colors.TEXT_PLACEHOLDER)
      .backgroundColor('transparent')
      .disabled(this.disabled)
      .maxLength(this.maxLength > 0 ? this.maxLength : undefined)
      .onChange((value: string) => {
        this.text = value
        this.onInput(value)
      })
      .onFocus(() => {
        this.onFocus()
      })
      .onBlur(() => {
        this.onBlur()
      })
  }
}
