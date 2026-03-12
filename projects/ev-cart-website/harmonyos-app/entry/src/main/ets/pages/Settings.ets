/**
 * 设置中心页面
 */

import { router } from '@kit.ArkUI';
import { StorageUtil } from '../utils/StorageUtil';
import { promptAction } from '@kit.ArkUI';

@Entry
@Component
struct Settings {
  @State userName: string = '';
  @State department: string = '';
  @State notifications: boolean = true;
  @State location: boolean = true;
  @State darkMode: boolean = false;

  aboutToAppear(): void {
    this.loadSettings();
  }

  async loadSettings(): Promise<void> {
    try {
      this.userName = await StorageUtil.getInstance().get('userName', '用户');
      this.department = await StorageUtil.getInstance().get('department', '部门');
      this.notifications = await StorageUtil.getInstance().get('notifications', true);
      this.location = await StorageUtil.getInstance().get('location', true);
      this.darkMode = await StorageUtil.getInstance().get('darkMode', false);
    } catch (error) {
      console.error('加载设置失败', error);
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      Scroll() {
        Column() {
          // 个人信息
          this.ProfileCard()
          
          // 通知设置
          this.NotificationSettings()
          
          // 隐私设置
          this.PrivacySettings()
          
          // 通用设置
          this.GeneralSettings()
          
          // 关于
          this.AboutCard()
          
          // 退出登录
          this.LogoutButton()
        }
        .width('100%')
        .padding(15)
      }
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  // 顶部导航
  @Builder Header() {
    Row() {
      Text('设置')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 个人信息卡片
  @Builder ProfileCard() {
    Column() {
      Row() {
        Column() {
          Text('👤')
            .fontSize(32)
        }
        .width(60)
        .height(60)
        .backgroundColor('#E3F2FD')
        .borderRadius(30)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Text(this.userName)
            .fontSize(18)
            .fontWeight(FontWeight.Medium)
            .fontColor('#212121')
          
          Text(this.department)
            .fontSize(14)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Image($r('sys.media.ohos_ic_public_arrow_right'))
          .width(20)
          .height(20)
          .fillColor('#757575')
      }
      .width('100%')
      .padding(15)
    }
    .width('100%')
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
    .onClick(() => {
      router.pushUrl({ url: 'pages/Profile' });
    })
  }

  // 通知设置
  @Builder NotificationSettings() {
    Column() {
      Text('通知设置')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      this.SettingItem('推送通知', this.notifications, (value: boolean) => {
        this.notifications = value;
        StorageUtil.getInstance().set('notifications', value);
      })
      
      this.SettingItem('声音提醒', true, (value: boolean) => {
        StorageUtil.getInstance().set('soundEnabled', value);
      })
      
      this.SettingItem('振动提醒', true, (value: boolean) => {
        StorageUtil.getInstance().set('vibrationEnabled', value);
      })
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 隐私设置
  @Builder PrivacySettings() {
    Column() {
      Text('隐私设置')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      this.SettingItem('位置权限', this.location, (value: boolean) => {
        this.location = value;
        StorageUtil.getInstance().set('location', value);
      })
      
      this.SettingItem('相机权限', true, (value: boolean) => {
        StorageUtil.getInstance().set('cameraEnabled', value);
      })
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 通用设置
  @Builder GeneralSettings() {
    Column() {
      Text('通用设置')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      this.SettingItem('深色模式', this.darkMode, (value: boolean) => {
        this.darkMode = value;
        StorageUtil.getInstance().set('darkMode', value);
      })
      
      this.SettingItem('清除缓存', false, (value: boolean) => {
        // 清除缓存
        promptAction.showToast({
          message: '缓存已清除',
          duration: 2000
        });
      }, true)
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 关于
  @Builder AboutCard() {
    Column() {
      Text('关于')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      this.AboutItem('版本号', '1.0.0')
      this.AboutItem('技术支持', '渔晓白')
      this.AboutItem('帮助中心', '', true)
      this.AboutItem('用户协议', '', true)
      this.AboutItem('隐私政策', '', true)
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 设置项
  @Builder SettingItem(label: string, checked: boolean, onChange: (value: boolean) => void, isButton: boolean = false) {
    Row() {
      Text(label)
        .fontSize(15)
        .fontColor('#212121')
        .layoutWeight(1)
      
      if (isButton) {
        Text('>')
          .fontSize(16)
          .fontColor('#757575')
      } else {
        Toggle({ type: ToggleType.Switch, isOn: checked })
          .selectedColor('#1976D2')
          .onChange(onChange)
      }
    }
    .width('100%')
    .padding({ top: 10, bottom: 10 })
  }

  // 关于项
  @Builder AboutItem(label: string, value: string, isLink: boolean = false) {
    Row() {
      Text(label)
        .fontSize(15)
        .fontColor('#212121')
        .layoutWeight(1)
      
      Text(isLink ? '>' : value)
        .fontSize(14)
        .fontColor('#757575')
    }
    .width('100%')
    .padding({ top: 10, bottom: 10 })
  }

  // 退出登录按钮
  @Builder LogoutButton() {
    Button('退出登录')
      .width('100%')
      .height(50)
      .backgroundColor('#F44336')
      .fontSize(16)
      .onClick(() => {
        promptAction.showDialog({
          title: '确认退出',
          message: '确定要退出登录吗？',
          buttons: [
            { text: '取消', color: '#757575' },
            { text: '确定', color: '#F44336' }
          ]
        }).then(result => {
          if (result.index === 1) {
            // 清除登录信息
            StorageUtil.getInstance().clear();
            router.replaceUrl({ url: 'pages/Login' });
          }
        });
      })
      .margin({ top: 20, bottom: 40 })
  }
}
