/**
 * 新建客户页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

@Entry
@Component
struct CreateCustomer {
  @State customerName: string = '';
  @State customerLevel: string = 'C';
  @State contactPerson: string = '';
  @State contactPhone: string = '';
  @State contactEmail: string = '';
  @State industry: string = '';
  @State address: string = '';
  @State remark: string = '';
  @State isSubmitting: boolean = false;
  
  private apiService: ApiService = new ApiService();

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 表单内容
      Scroll() {
        Column() {
          // 基本信息
          this.BasicInfoSection()
          
          // 联系信息
          this.ContactInfoSection()
          
          // 其他信息
          this.OtherInfoSection()
        }
        .width('100%')
        .padding(20)
      }
      .layoutWeight(1)
      
      // 底部提交按钮
      this.BottomBar()
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
      
      Text('新建客户')
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

  // 基本信息
  @Builder BasicInfoSection() {
    Column() {
      Text('基本信息')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      // 客户名称
      Column() {
        Row() {
          Text('客户名称 *')
            .fontSize(14)
            .fontColor('#757575')
        }
        .width('100%')
        
        TextInput({ placeholder: '请输入客户名称', text: this.customerName })
          .width('100%')
          .height(45)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .padding({ left: 15, right: 15 })
          .onChange((value: string) => {
            this.customerName = value;
          })
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 客户等级
      Column() {
        Row() {
          Text('客户等级 *')
            .fontSize(14)
            .fontColor('#757575')
        }
        .width('100%')
        
        Row() {
          this.LevelOption('A', '#F44336')
          this.LevelOption('B', '#FF9800')
          this.LevelOption('C', '#4CAF50')
          this.LevelOption('D', '#2196F3')
        }
        .width('100%')
      }
      .width('100%')
      .margin({ bottom: 15 })
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .borderRadius(12)
    .margin({ bottom: 10 })
  }

  // 等级选项
  @Builder LevelOption(level: string, color: string) {
    Column() {
      Text(`${level}级`)
        .fontSize(14)
        .fontWeight(this.customerLevel === level ? FontWeight.Bold : FontWeight.Normal)
        .fontColor(this.customerLevel === level ? '#FFFFFF' : '#757575')
        .padding({ left: 20, right: 20, top: 10, bottom: 10 })
        .backgroundColor(this.customerLevel === level ? color : '#F5F5F5')
        .borderRadius(8)
        .onClick(() => {
          this.customerLevel = level;
        })
    }
    .margin({ right: 10 })
  }

  // 联系信息
  @Builder ContactInfoSection() {
    Column() {
      Text('联系信息')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      // 联系人
      Column() {
        Row() {
          Text('联系人 *')
            .fontSize(14)
            .fontColor('#757575')
        }
        .width('100%')
        
        TextInput({ placeholder: '请输入联系人姓名', text: this.contactPerson })
          .width('100%')
          .height(45)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .padding({ left: 15, right: 15 })
          .onChange((value: string) => {
            this.contactPerson = value;
          })
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 联系电话
      Column() {
        Row() {
          Text('联系电话 *')
            .fontSize(14)
            .fontColor('#757575')
        }
        .width('100%')
        
        TextInput({ placeholder: '请输入联系电话', text: this.contactPhone })
          .width('100%')
          .height(45)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .padding({ left: 15, right: 15 })
          .onChange((value: string) => {
            this.contactPhone = value;
          })
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 电子邮箱
      Column() {
        Row() {
          Text('电子邮箱')
            .fontSize(14)
            .fontColor('#757575')
        }
        .width('100%')
        
        TextInput({ placeholder: '请输入电子邮箱', text: this.contactEmail })
          .width('100%')
          .height(45)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .padding({ left: 15, right: 15 })
          .onChange((value: string) => {
            this.contactEmail = value;
          })
      }
      .width('100%')
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .borderRadius(12)
    .margin({ bottom: 10 })
  }

  // 其他信息
  @Builder OtherInfoSection() {
    Column() {
      Text('其他信息')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      // 所属行业
      Column() {
        Row() {
          Text('所属行业')
            .fontSize(14)
            .fontColor('#757575')
        }
        .width('100%')
        
        TextInput({ placeholder: '请输入所属行业', text: this.industry })
          .width('100%')
          .height(45)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .padding({ left: 15, right: 15 })
          .onChange((value: string) => {
            this.industry = value;
          })
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 客户地址
      Column() {
        Row() {
          Text('客户地址')
            .fontSize(14)
            .fontColor('#757575')
        }
        .width('100%')
        
        TextInput({ placeholder: '请输入客户地址', text: this.address })
          .width('100%')
          .height(45)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .padding({ left: 15, right: 15 })
          .onChange((value: string) => {
            this.address = value;
          })
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 备注
      Column() {
        Row() {
          Text('备注')
            .fontSize(14)
            .fontColor('#757575')
        }
        .width('100%')
        
        TextArea({ placeholder: '请输入备注信息', text: this.remark })
          .width('100%')
          .height(100)
          .backgroundColor('#F5F5F5')
          .borderRadius(8)
          .padding(15)
          .onChange((value: string) => {
            this.remark = value;
          })
      }
      .width('100%')
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .borderRadius(12)
    .margin({ bottom: 10 })
  }

  // 底部提交按钮
  @Builder BottomBar() {
    Button('保存客户')
      .width('100%')
      .height(50)
      .backgroundColor(this.canSubmit() ? '#4CAF50' : '#BDBDBD')
      .fontSize(16)
      .fontWeight(FontWeight.Medium)
      .enabled(this.canSubmit() && !this.isSubmitting)
      .onClick(() => {
        this.submit();
      })
  }

  // 是否可以提交
  canSubmit(): boolean {
    return this.customerName.trim().length > 0 &&
           this.contactPerson.trim().length > 0 &&
           this.contactPhone.trim().length >= 11;
  }

  // 提交
  async submit(): Promise<void> {
    if (!this.canSubmit()) {
      // TODO: 显示错误提示
      return;
    }

    this.isSubmitting = true;

    try {
      const customerData = {
        customerName: this.customerName,
        customerLevel: this.customerLevel,
        contactPerson: this.contactPerson,
        contactPhone: this.contactPhone,
        contactEmail: this.contactEmail,
        industry: this.industry,
        address: this.address,
        remark: this.remark,
      };

      await this.apiService.post('/mobile/customers', customerData);

      // TODO: 显示成功提示
      router.back();
    } catch (error) {
      console.error('创建客户失败', error);
      // TODO: 显示错误提示
    } finally {
      this.isSubmitting = false;
    }
  }
}
