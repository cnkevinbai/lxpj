// 登录页面
import { router } from '@ohos.router'
import { authService } from '../common/services/AuthService'
import { ROUTES, COLORS, FONTS, SPACING } from '../common/utils/Constants'

@Entry
@Component
struct Login {
  @StorageLink('username'): string = ''
  @StorageLink('password'): string = ''
  @State loading: boolean = false
  @State errorMessage: string = ''

  build() {
    Column() {
      // Logo 区域
      Column() {
        Image($r('app.media.logo'))
          .width(120)
          .height(120)
          .margin({ bottom: 20 })

        Text('EV Cart')
          .fontSize(28)
          .fontWeight(FontWeight.Bold)
          .fontColor(COLORS.PRIMARY)

        Text('企业移动办公系统')
          .fontSize(16)
          .fontColor(COLORS.TEXT_SECONDARY)
          .margin({ top: 8 })
      }
      .width('100%')
      .padding({ top: 80, bottom: 40 })
      .justifyContent(FlexAlign.Center)

      // 登录表单
      Column() {
        // 用户名输入框
        TextInput({ placeholder: '用户名', text: this.username })
          .onChange((value) => {
            this.username = value
            this.errorMessage = ''
          })
          .width('100%')
          .height(50)
          .backgroundColor('#fff')
          .borderRadius(8)
          .padding({ left: 16, right: 16 })
          .margin({ bottom: 16 })

        // 密码输入框
        TextInput({ placeholder: '密码', text: this.password, type: InputType.Password })
          .onChange((value) => {
            this.password = value
            this.errorMessage = ''
          })
          .width('100%')
          .height(50)
          .backgroundColor('#fff')
          .borderRadius(8)
          .padding({ left: 16, right: 16 })
          .margin({ bottom: 16 })

        // 错误提示
        if (this.errorMessage) {
          Text(this.errorMessage)
            .fontSize(14)
            .fontColor(COLORS.ERROR)
            .width('100%')
            .textAlign(TextAlign.Center)
            .margin({ bottom: 16 })
        }

        // 登录按钮
        Button() {
          if (this.loading) {
            LoadingProgress()
              .width(20)
              .height(20)
              .color('#fff')
          } else {
            Text('登录')
              .fontSize(16)
              .fontWeight(FontWeight.Bold)
              .fontColor('#fff')
          }
        }
        .width('100%')
        .height(50)
        .backgroundColor(COLORS.PRIMARY)
        .borderRadius(8)
        .onClick(() => this.handleLogin())
        .margin({ bottom: 16 })

        // 记住密码
        Row() {
          Checkbox({ name: 'remember', group: 'remember' })
            .select(true)

          Text('记住密码')
            .fontSize(14)
            .fontColor(COLORS.TEXT_SECONDARY)
            .margin({ left: 8 })
        }
        .width('100%')
        .justifyContent(FlexAlign.Start)
      }
      .width('100%')
      .padding({ left: SPACING.NORMAL, right: SPACING.NORMAL })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(COLORS.BACKGROUND)
  }

  // 处理登录
  async handleLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = '请输入用户名和密码'
      return
    }

    this.loading = true
    this.errorMessage = ''

    try {
      const result = await authService.login(this.username, this.password)
      
      // 跳转到首页
      router.replaceUrl({
        url: ROUTES.INDEX,
      })
    } catch (error) {
      this.errorMessage = '用户名或密码错误'
    } finally {
      this.loading = false
    }
  }
}
