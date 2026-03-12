// 导航栏组件
@Component
export struct NavBar {
  @Prop title: string = ''
  @Prop showBack?: boolean = true
  onBack?: () => void

  build() {
    Row() {
      // 返回按钮
      if (this.showBack) {
        Button() {
          Image($r('app.media.ic_back'))
            .width(24)
            .height(24)
        }
        .type(ButtonType.Capsule)
        .plain(true)
        .onClick(() => {
          if (this.onBack) {
            this.onBack()
          } else {
            router.back()
          }
        })
      }

      // 标题
      Text(this.title)
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#fff')
        .flexGrow(1)
        .textAlign(TextAlign.Center)
    }
    .width('100%')
    .height(56)
    .backgroundColor('#1890ff')
    .padding({ left: 16, right: 16 })
    .alignItems(VerticalAlign.Center)
  }
}
