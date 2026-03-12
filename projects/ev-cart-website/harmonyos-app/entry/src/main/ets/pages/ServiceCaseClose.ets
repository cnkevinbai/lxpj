/**
 * 服务结案页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

@Entry
@Component
struct ServiceCaseClose {
  @State serviceOrderId: string = '';
  @State serviceOrderNo: string = '';
  @State customerName: string = '';
  @State totalAmount: number = 0;
  @State paidAmount: number = 0;
  @State satisfactionScore: number = 5;
  @State closeReason: string = '';
  @State isSubmitting: boolean = false;
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    const params = router.getParams() as Record<string, string>;
    this.serviceOrderId = params['id'] || '';
    this.loadServiceOrder();
  }

  async loadServiceOrder(): Promise<void> {
    try {
      const data = await this.apiService.get(`/mobile/service-orders/${this.serviceOrderId}`);
      this.serviceOrderNo = data.orderNo;
      this.customerName = data.customerName;
      this.totalAmount = data.totalAmount;
      this.paidAmount = data.paidAmount;
    } catch (error) {
      console.error('加载服务单失败', error);
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 表单内容
      Scroll() {
        Column() {
          // 服务单信息
          this.ServiceOrderInfo()
          
          // 费用结算
          this.PaymentSettlement()
          
          // 满意度评价
          this.SatisfactionRating()
          
          // 结案原因
          this.CloseReasonSection()
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
      
      Text('服务结案')
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

  // 服务单信息
  @Builder ServiceOrderInfo() {
    Column() {
      Text('服务单信息')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      this.InfoRow('服务单号', this.serviceOrderNo)
      this.InfoRow('客户名称', this.customerName)
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .borderRadius(12)
    .margin({ bottom: 10 })
  }

  // 信息行
  @Builder InfoRow(label: string, value: string) {
    Row() {
      Text(label)
        .fontSize(14)
        .fontColor('#757575')
        .width(100)
      
      Text(value)
        .fontSize(14)
        .fontColor('#212121')
        .layoutWeight(1)
    }
    .width('100%')
    .padding({ top: 15, bottom: 15 })
  }

  // 费用结算
  @Builder PaymentSettlement() {
    Column() {
      Text('费用结算')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      Row() {
        Column() {
          Text('总费用')
            .fontSize(12)
            .fontColor('#757575')
          
          Text('¥' + (this.totalAmount / 10000).toFixed(2) + '万')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor('#212121')
            .margin({ top: 5 })
        }
        .width('50%')
        
        Column() {
          Text('已支付')
            .fontSize(12)
            .fontColor('#757575')
          
          Text('¥' + (this.paidAmount / 10000).toFixed(2) + '万')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor('#4CAF50')
            .margin({ top: 5 })
        }
        .width('50%')
      }
      .width('100%')
      
      if (this.totalAmount > this.paidAmount) {
        Row() {
          Text('未结金额')
            .fontSize(12)
            .fontColor('#757575')
          
          Blank()
          
          Text('¥' + ((this.totalAmount - this.paidAmount) / 10000).toFixed(2) + '万')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor('#F44336')
        }
        .width('100%')
        .margin({ top: 15 })
      }
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .borderRadius(12)
    .margin({ bottom: 10 })
  }

  // 满意度评价
  @Builder SatisfactionRating() {
    Column() {
      Text('满意度评价')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      Row() {
        ForEach(Array.from({ length: 5 }), (_, index) => {
          Text(index < this.satisfactionScore ? '⭐' : '☆')
            .fontSize(32)
            .onClick(() => {
              this.satisfactionScore = index + 1;
            })
        })
      }
      .width('100%')
      .justifyContent(FlexAlign.Center)
      
      Text(this.getSatisfactionText())
        .fontSize(14)
        .fontColor('#757575')
        .margin({ top: 10 })
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .borderRadius(12)
    .margin({ bottom: 10 })
  }

  // 结案原因
  @Builder CloseReasonSection() {
    Column() {
      Text('结案原因')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      TextArea({ placeholder: '请输入结案原因', text: this.closeReason })
        .width('100%')
        .height(100)
        .backgroundColor('#F5F5F5')
        .borderRadius(8)
        .padding(15)
        .onChange((value: string) => {
          this.closeReason = value;
        })
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .borderRadius(12)
    .margin({ bottom: 10 })
  }

  // 底部提交按钮
  @Builder BottomBar() {
    Button('确认结案')
      .width('100%')
      .height(50)
      .backgroundColor('#4CAF50')
      .fontSize(16)
      .fontWeight(FontWeight.Medium)
      .enabled(!this.isSubmitting)
      .onClick(() => {
        this.submit();
      })
  }

  // 获取满意度文字
  getSatisfactionText(): string {
    const texts: Record<number, string> = {
      1: '非常不满意',
      2: '不满意',
      3: '一般',
      4: '满意',
      5: '非常满意',
    };
    return texts[this.satisfactionScore] || '';
  }

  // 提交
  async submit(): Promise<void> {
    this.isSubmitting = true;

    try {
      await this.apiService.post(`/mobile/service-orders/${this.serviceOrderId}/close`, {
        satisfactionScore: this.satisfactionScore,
        closeReason: this.closeReason,
      });

      // TODO: 显示成功提示
      router.back();
    } catch (error) {
      console.error('服务结案失败', error);
      // TODO: 显示错误提示
    } finally {
      this.isSubmitting = false;
    }
  }
}
