/**
 * 输入框组件
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { Colors } from '../constants/Colors'
import { Styles } from '../constants/Styles'

@Component
export struct Input {
  @Link value: string
  @Prop placeholder: string = '请输入'
  @Prop type: 'text' | 'number' | 'password' | 'phone' | 'email' = 'text'
  @Prop disabled: boolean = false
  @Prop clearable: boolean = true
  @Prop maxLength: number = 0
  @Prop prefix: Resource | null = null
  @Prop suffix: Resource | null = null
  onFocus: () => void = () => {}
  onBlur: () => void = () => {}
  onInput: (value: string) => void = () => {}

  build() {
    Row() {
      // 前缀图标
      if (this.prefix) {
        Image(this.prefix)
          .width(20)
          .height(20)
          .margin({ right: 8 })
      }

      // 输入框
      TextInput({ text: this.value, placeholder: this.placeholder })
        .type(this.getInputType())
        .fontSize(Styles.FONT_SIZE.md)
        .fontColor(Colors.TEXT_PRIMARY)
        .placeholderColor(Colors.TEXT_PLACEHOLDER)
        .backgroundColor('transparent')
        .layoutWeight(1)
        .disabled(this.disabled)
        .maxLength(this.maxLength > 0 ? this.maxLength : undefined)
        .onChange((value: string) => {
          this.value = value
          this.onInput(value)
        })
        .onFocus(() => {
          this.onFocus()
        })
        .onBlur(() => {
          this.onBlur()
        })

      // 清除按钮
      if (this.clearable && this.value && !this.disabled) {
        Image($r('app.media.icon_clear'))
          .width(16)
          .height(16)
          .fillColor(Colors.TEXT_PLACEHOLDER)
          .margin({ left: 8 })
          .onClick(() => {
            this.value = ''
            this.onInput('')
          })
      }

      // 后缀图标
      if (this.suffix) {
        Image(this.suffix)
          .width(20)
          .height(20)
          .margin({ left: 8 })
      }
    }
    .width('100%')
    .height(48)
    .padding({ left: 16, right: 16 })
    .backgroundColor(Colors.BG_DISABLED)
    .borderRadius(Styles.RADIUS.md)
  }

  private getInputType(): InputType {
    switch (this.type) {
      case 'number':
        return InputType.Numeric
      case 'password':
        return InputType.Password
      case 'phone':
        return InputType.Number
      case 'email':
        return InputType.Email
      default:
        return InputType.Text
    }
  }
}
