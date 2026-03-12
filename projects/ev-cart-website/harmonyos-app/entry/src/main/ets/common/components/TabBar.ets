// 底部导航组件
import { router } from '@ohos.router'
import { ROUTES, COLORS } from '../utils/Constants'

@Component
export struct TabBar {
  @Prop currentIndex: number = 0

  build() {
    Row() {
      // 首页
      this.TabItem('首页', $r('app.media.ic_home'), 0)

      // 客户
      this.TabItem('客户', $r('app.media.ic_customer'), 1)

      // 订单
      this.TabItem('订单', $r('app.media.ic_order'), 2)

      // 库存
      this.TabItem('库存', $r('app.media.ic_inventory'), 3)

      // 我的
      this.TabItem('我的', $r('app.media.ic_profile'), 4)
    }
    .width('100%')
    .height(60)
    .backgroundColor('#fff')
    .justifyContent(FlexAlign.SpaceAround)
    .alignItems(VerticalAlign.Center)
    .borderWidth({ top: 1 })
    .borderColor(COLORS.BORDER)
  }

  @Builder
  TabItem(title: string, icon: Resource, index: number) {
    Column() {
      Image(icon)
        .width(24)
        .height(24)
        .fillColor(this.currentIndex === index ? COLORS.PRIMARY : COLORS.TEXT_DISABLED)

      Text(title)
        .fontSize(12)
        .fontColor(this.currentIndex === index ? COLORS.PRIMARY : COLORS.TEXT_DISABLED)
        .margin({ top: 4 })
    }
    .width(60)
    .onClick(() => {
      this.navigateTo(index)
    })
  }

  navigateTo(index: number) {
    const routes = [
      ROUTES.INDEX,
      ROUTES.CUSTOMERS,
      ROUTES.ORDERS,
      ROUTES.INVENTORY,
      ROUTES.PROFILE,
    ]
    router.replaceUrl({ url: routes[index] })
  }
}
