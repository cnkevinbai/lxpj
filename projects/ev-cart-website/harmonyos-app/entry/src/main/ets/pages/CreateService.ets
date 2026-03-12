/**
 * 创建售后服务单页面
 * 客户在线报修
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';
import { promptAction } from '@kit.ArkUI';

@Entry
@Component
struct CreateService {
  @State selectedType: string = 'repair';
  @State selectedLevel: string = 'normal';
  @State customerName: string = '';
  @State contactPhone: string = '';
  @State serviceRequest: string = '';
  @State faultDescription: string = '';
  @State appointmentDate: string = '';
  @State isSubmitting: boolean = false;
  
  private apiService: ApiService = new ApiService();

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 表单内容
      Scroll() {
        Column() {
          // 服务类型选择
          this.ServiceTypeSection()
          
          // 服务级别
          this.ServiceLevelSection()
          
          // 联系信息
          this.ContactSection()
          
          // 服务请求
          this.RequestSection()
          
          // 预约时间
          this.AppointmentSection()
          
          // 提交按钮
          this.SubmitButton()
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
      Image($r('sys.media.ohos_ic_public_arrow_left'))
        .width(24)
        .height(24)
        .onClick(() => {
          router.back();
        })
      
      Text('在线报修')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .margin({ left: 15 })
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 服务类型选择
  @Builder ServiceTypeSection() {
    Column() {
      Text('服务类型')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      Flex({ wrap: FlexWrap.Wrap }) {
        this.TypeItem('repair', '🔧', '维修服务')
        this.TypeItem('maintenance', '🛠️', '保养服务')
        this.TypeItem('installation', '📦', '安装服务')
        this.TypeItem('training', '📚', '培训服务')
        this.TypeItem('consultation', '💡', '咨询服务')
        this.TypeItem('complaint', '⚠️', '投诉建议')
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 类型项
  @Builder TypeItem(type: string, icon: string, label: string) {
    Column() {
      Text(icon)
        .fontSize(28)
        .margin({ bottom: 8 })
      
      Text(label)
        .fontSize(13)
        .fontColor(this.selectedType === type ? '#1976D2' : '#757575')
    }
    .width('30%')
    .padding(15)
    .backgroundColor(this.selectedType === type ? '#E3F2FD' : '#F5F5F5')
    .borderRadius(8)
    .margin({ bottom: 10 })
    .onClick(() => {
      this.selectedType = type;
    })
  }

  // 服务级别
  @Builder ServiceLevelSection() {
    Column() {
      Text('服务级别')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      Row() {
        this.LevelItem('normal', '普通', '#4CAF50')
        this.LevelItem('urgent', '紧急', '#FF9800')
        this.LevelItem('critical', '特急', '#F44336')
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceEvenly)
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 级别项
  @Builder LevelItem(level: string, label: string, color: string) {
    Column() {
      Text(label)
        .fontSize(15)
        .fontWeight(FontWeight.Medium)
        .fontColor(this.selectedLevel === level ? '#FFFFFF' : '#757575')
    }
    .width('30%')
    .padding(15)
    .backgroundColor(this.selectedLevel === level ? color : '#F5F5F5')
    .borderRadius(8)
    .onClick(() => {
      this.selectedLevel = level;
    })
  }

  // 联系信息
  @Builder ContactSection() {
    Column() {
      Text('联系信息')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      TextInput({ placeholder: '姓名', text: this.customerName })
        .width('100%')
        .height(50)
        .backgroundColor('#F5F5F5')
        .borderRadius(8)
        .padding({ left: 15, right: 15 })
        .margin({ bottom: 15 })
        .onChange((value: string) => {
          this.customerName = value;
        })
      
      TextInput({ placeholder: '联系电话', text: this.contactPhone })
        .type(InputType.Number)
        .width('100%')
        .height(50)
        .backgroundColor('#F5F5F5')
        .borderRadius(8)
        .padding({ left: 15, right: 15 })
        .onChange((value: string) => {
          this.contactPhone = value;
        })
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 服务请求
  @Builder RequestSection() {
    Column() {
      Text('服务请求')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      TextArea({ placeholder: '请详细描述您的问题或需求', text: this.serviceRequest })
        .width('100%')
        .height(120)
        .backgroundColor('#F5F5F5')
        .borderRadius(8)
        .padding(15)
        .margin({ bottom: 15 })
        .onChange((value: string) => {
          this.serviceRequest = value;
        })
      
      TextArea({ placeholder: '故障描述（可选）', text: this.faultDescription })
        .width('100%')
        .height(100)
        .backgroundColor('#F5F5F5')
        .borderRadius(8)
        .padding(15)
        .onChange((value: string) => {
          this.faultDescription = value;
        })
      
      // 上传图片按钮
      Row() {
        Column() {
          Image($r('sys.media.ohos_ic_public_add'))
            .width(30)
            .height(30)
            .fillColor('#9E9E9E')
          
          Text('上传故障图片')
            .fontSize(12)
            .fontColor('#9E9E9E')
            .margin({ top: 5 })
        }
        .width(80)
        .height(80)
        .backgroundColor('#F5F5F5')
        .borderRadius(8)
        .justifyContent(FlexAlign.Center)
      }
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 预约时间
  @Builder AppointmentSection() {
    Column() {
      Text('预约时间（可选）')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      Row() {
        Text(this.appointmentDate || '选择预约时间')
          .fontSize(15)
          .fontColor(this.appointmentDate ? '#212121' : '#9E9E9E')
        
        Blank()
        
        Image($r('sys.media.ohos_ic_public_calendar'))
          .width(24)
          .height(24)
          .fillColor('#1976D2')
      }
      .width('100%')
      .height(50)
      .backgroundColor('#F5F5F5')
      .borderRadius(8)
      .padding({ left: 15, right: 15 })
      .onClick(() => {
        // 打开日期选择器
      })
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 提交按钮
  @Builder SubmitButton() {
    Button('提交报修')
      .width('100%')
      .height(50)
      .backgroundColor('#1976D2')
      .borderRadius(8)
      .fontSize(16)
      .fontWeight(FontWeight.Medium)
      .enabled(!this.isSubmitting)
      .onClick(() => {
        this.submitServiceOrder();
      })
  }

  // 提交服务单
  async submitServiceOrder(): Promise<void> {
    // 验证必填项
    if (!this.customerName || !this.contactPhone || !this.serviceRequest) {
      promptAction.showToast({
        message: '请填写必填项',
        duration: 2000
      });
      return;
    }

    this.isSubmitting = true;

    try {
      await this.apiService.post('/mobile/service-orders', {
        source: 'app',
        customerName: this.customerName,
        contactPhone: this.contactPhone,
        serviceType: this.selectedType,
        serviceLevel: this.selectedLevel,
        serviceRequest: this.serviceRequest,
        faultDescription: this.faultDescription,
        appointmentTime: this.appointmentDate ? new Date(this.appointmentDate).toISOString() : null
      });

      promptAction.showToast({
        message: '报修提交成功',
        duration: 2000
      });

      router.back();
    } catch (error) {
      console.error('提交报修失败', error);
      promptAction.showToast({
        message: '提交失败，请重试',
        duration: 2000
      });
    } finally {
      this.isSubmitting = false;
    }
  }
}
