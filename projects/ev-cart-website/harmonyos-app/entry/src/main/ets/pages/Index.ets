/**
 * 首页
 * 登录/主界面入口
 */

import { router } from '@kit.ArkUI';
import { StorageUtil } from '../utils/StorageUtil';

@Entry
@Component
struct Index {
  @State isLoading: boolean = true;
  @State isLoggedIn: boolean = false;

  aboutToAppear(): void {
    // 检查登录状态
    this.checkLoginStatus();
  }

  async checkLoginStatus(): Promise<void> {
    try {
      const token = await StorageUtil.getInstance().get('accessToken');
      this.isLoggedIn = !!token;
    } catch (error) {
      console.error('检查登录状态失败', error);
      this.isLoggedIn = false;
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      if (this.isLoading) {
        // 加载页面
        this.LoadingView()
      } else if (this.isLoggedIn) {
        // 主页面
        this.MainView()
      } else {
        // 登录页面
        this.LoginView()
      }
    }
    .width('100%')
    .height('100%')
  }

  // 加载页面
  @Builder LoadingView() {
    Column() {
      LoadingProgress()
        .width(50)
        .height(50)
        .color('#1976D2')
      
      Text('道达智能')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#1976D2')
        .margin({ top: 20 })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
  }

  // 登录页面
  @Builder LoginView() {
    Column() {
      // Logo
      Text('道达智能')
        .fontSize(32)
        .fontWeight(FontWeight.Bold)
        .fontColor('#1976D2')
        .margin({ bottom: 50 })
      
      // 登录表单
      Column() {
        TextInput({ placeholder: '请输入用户名' })
          .width('100%')
          .height(50)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .padding({ left: 15, right: 15 })
          .margin({ bottom: 15 })
        
        TextInput({ placeholder: '请输入密码' })
          .type(InputType.Password)
          .width('100%')
          .height(50)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .padding({ left: 15, right: 15 })
          .margin({ bottom: 20 })
        
        Button('登录')
          .width('100%')
          .height(50)
          .backgroundColor('#1976D2')
          .borderRadius(8)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .onClick(() => {
            router.pushUrl({ url: 'pages/Dashboard' });
          })
      }
      .width('85%')
      .padding(20)
      
      // 其他登录方式
      Row() {
        Text('短信登录')
          .fontColor('#1976D2')
          .onClick(() => {
            // 跳转到短信登录
          })
        
        Text('忘记密码？')
          .fontColor('#1976D2')
          .margin({ left: 20 })
          .onClick(() => {
            // 跳转到忘记密码
          })
      }
      .width('85%')
      .justifyContent(FlexAlign.SpaceBetween)
      .margin({ top: 20 })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }

  // 主页面
  @Builder MainView() {
    Column() {
      Text('欢迎使用道达智能')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ bottom: 20 })
      
      Button('进入工作台')
        .width('200')
        .height(50)
        .backgroundColor('#1976D2')
        .borderRadius(8)
        .onClick(() => {
          router.pushUrl({ url: 'pages/Dashboard' });
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
  }
}
