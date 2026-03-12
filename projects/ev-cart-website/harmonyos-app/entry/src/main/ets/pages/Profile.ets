// 个人中心页面
import { router } from '@ohos.router'
import { authService } from '../common/services/AuthService'
import { ROUTES, COLORS, SPACING } from '../common/utils/Constants'
import { User } from '../common/models/Customer'

@Entry
@Component
struct Profile {
  @State user: User | null = null
  @State loading: boolean = true

  aboutToAppear() {
    this.loadUser()
  }

  build() {
    Column() {
      // 顶部导航
      Row() {
        Text('个人中心')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#fff')
      }
      .width('100%')
      .height(56)
      .backgroundColor('#1890ff')
      .padding({ left: 16, right: 16 })
      .alignItems(VerticalAlign.Center)

      Scroll() {
        Column() {
          // 用户信息卡片
          Column() {
            // 头像
            Column() {
              Text(this.user?.realName?.charAt(0) || this.user?.username?.charAt(0) || 'U')
                .fontSize(36)
                .fontWeight(FontWeight.Bold)
                .fontColor('#fff')
            }
            .width(80)
            .height(80)
            .backgroundColor('#1890ff')
            .borderRadius(40)
            .justifyContent(FlexAlign.Center)

            // 用户名
            Text(this.user?.realName || this.user?.username || '用户')
              .fontSize(20)
              .fontWeight(FontWeight.Bold)
              .fontColor('#fff')
              .margin({ top: 16 })

            // 角色
            Text(this.user?.role?.roleName || '普通用户')
              .fontSize(14)
              .fontColor('rgba(255,255,255,0.8)')
              .margin({ top: 8 })
          }
          .width('100%')
          .padding({ top: 40, bottom: 40 })
          .backgroundColor('#1890ff')
          .alignItems(HorizontalAlign.Center)

          // 功能菜单
          Column() {
            // 我的订单
            this.MenuItem('我的订单', $r('app.media.ic_order'), () => {
              router.pushUrl({ url: ROUTES.ORDERS })
            })

            Divider()
              .strokeWidth(1)
              .color(COLORS.BORDER)
              .margin({ left: 60 })

            // 我的客户
            this.MenuItem('我的客户', $r('app.media.ic_customer'), () => {
              router.pushUrl({ url: ROUTES.CUSTOMERS })
            })

            Divider()
              .strokeWidth(1)
              .color(COLORS.BORDER)
              .margin({ left: 60 })

            // 库存查询
            this.MenuItem('库存查询', $r('app.media.ic_inventory'), () => {
              router.pushUrl({ url: ROUTES.INVENTORY })
            })

            Divider()
              .strokeWidth(1)
              .color(COLORS.BORDER)
              .margin({ left: 60 })

            // 财务报表
            this.MenuItem('财务报表', $r('app.media.ic_finance'), () => {
              router.pushUrl({ url: ROUTES.FINANCE })
            })

            Divider()
              .strokeWidth(1)
              .color(COLORS.BORDER)
              .margin({ left: 60 })

            // 系统设置
            this.MenuItem('系统设置', $r('app.media.ic_setting'), () => {
              // 跳转到设置页面
            })

            Divider()
              .strokeWidth(1)
              .color(COLORS.BORDER)
              .margin({ left: 60 })

            // 关于我们
            this.MenuItem('关于我们', $r('app.media.ic_info'), () => {
              // 跳转到关于页面
            })
          }
          .width('100%')
          .backgroundColor('#fff')
          .padding({ top: 16, bottom: 16 })

          // 退出登录按钮
          Button() {
            Text('退出登录')
              .fontSize(16)
              .fontWeight(FontWeight.Bold)
              .fontColor('#fff')
          }
          .width('90%')
          .height(50)
          .backgroundColor(COLORS.ERROR)
          .borderRadius(8)
          .margin({ top: 32 })
          .onClick(() => this.handleLogout())
        }
      }
      .width('100%')
      .flexGrow(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(COLORS.BACKGROUND)
  }

  // 菜单项组件
  @Builder
  MenuItem(title: string, icon: Resource, onClick: () => void) {
    Row() {
      Image(icon)
        .width(24)
        .height(24)
        .margin({ right: 16 })

      Text(title)
        .fontSize(16)
        .fontColor(COLORS.TEXT_PRIMARY)
        .flexGrow(1)

      Image($r('app.media.ic_arrow_right'))
        .width(16)
        .height(16)
    }
    .width('100%')
    .padding(16)
    .onClick(onClick)
  }

  // 加载用户信息
  async loadUser() {
    try {
      this.user = await authService.getCurrentUser()
    } catch (error) {
      console.error('Load user failed:', error)
    } finally {
      this.loading = false
    }
  }

  // 处理退出登录
  async handleLogout() {
    try {
      await authService.logout()
      router.replaceUrl({ url: ROUTES.LOGIN })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
}
