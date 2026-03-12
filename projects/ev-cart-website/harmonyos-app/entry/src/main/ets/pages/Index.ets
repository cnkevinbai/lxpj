// 鸿蒙 APP 首页
@Entry
@Component
struct Index {
  @State message: string = '欢迎使用 EV Cart'

  build() {
    Column() {
      // 顶部导航
      Row() {
        Text('EV Cart')
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
          .fontColor('#fff')
      }
      .width('100%')
      .height(56)
      .backgroundColor('#1890ff')
      .padding({ left: 16, right: 16 })

      // 内容区域
      Column() {
        Text(this.message)
          .fontSize(20)
          .margin({ top: 40 })

        // 功能入口
        Row({ space: 20 }) {
          Button('客户管理')
            .width(140)
            .height(50)
            .backgroundColor('#52c41a')
            .onClick(() => {
              // 跳转到客户管理
            })

          Button('订单管理')
            .width(140)
            .height(50)
            .backgroundColor('#faad14')
            .onClick(() => {
              // 跳转到订单管理
            })
        }
        .margin({ top: 40 })

        Row({ space: 20 }) {
          Button('库存查询')
            .width(140)
            .height(50)
            .backgroundColor('#722ed1')
            .onClick(() => {
              // 跳转到库存查询
            })

          Button('财务报表')
            .width(140)
            .height(50)
            .backgroundColor('#13c2c2')
            .onClick(() => {
              // 跳转到财务报表
            })
        }
        .margin({ top: 20 })
      }
      .width('100%')
      .flexGrow(1)
      .justifyContent(FlexAlign.Start)
      .padding(20)

      // 底部导航
      Row() {
        Button('首页')
          .type(ButtonType.Capsule)
          .plain(true)
          .onClick(() => {})

        Button('消息')
          .type(ButtonType.Capsule)
          .plain(true)
          .onClick(() => {})

        Button('我的')
          .type(ButtonType.Capsule)
          .plain(true)
          .onClick(() => {})
      }
      .width('100%')
      .height(60)
      .backgroundColor('#fff')
      .justifyContent(FlexAlign.SpaceAround)
      .alignItems(VerticalAlign.Center)
    }
    .width('100%')
    .height('100%')
  }
}
