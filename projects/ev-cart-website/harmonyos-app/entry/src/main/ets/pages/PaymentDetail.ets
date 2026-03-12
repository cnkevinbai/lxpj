/**
 * 收款详情页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface Payment {
  id: string;
  paymentNo: string;
  customerName: string;
  customerId: string;
  orderNo?: string;
  orderId?: string;
  amount: number;
  paymentMethod: string;
  status: string;
  paymentDate: string;
  createdAt: string;
  salespersonName: string;
  remark?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

@Entry
@Component
struct PaymentDetail {
  @State payment: Payment | null = null;
  @State isLoading: boolean = true;
  
  private apiService: ApiService = new ApiService();
  private paymentId: string = '';

  aboutToAppear(): void {
    const params = router.getParams() as Record<string, string>;
    this.paymentId = params['id'] || '';
    this.loadPayment();
  }

  async loadPayment(): Promise<void> {
    try {
      const data = await this.apiService.get(`/mobile/payments/${this.paymentId}`);
      this.payment = data;
    } catch (error) {
      console.error('加载收款详情失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else if (this.payment) {
        // 收款状态卡片
        this.PaymentStatusCard()
        
        // 收款信息
        this.PaymentInfo()
        
        // 客户信息
        this.CustomerInfo()
        
        // 备注信息
        if (this.payment.remark) {
          this.RemarkSection()
        }
      }
      
      // 底部操作栏
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
      
      Text('收款详情')
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

  // 收款状态卡片
  @Builder PaymentStatusCard() {
    Column() {
      Row() {
        Text(this.payment?.paymentNo || '')
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor('#212121')
        
        Text(this.getStatusBadge(this.payment?.status || ''))
          .fontSize(12)
          .fontColor('#FFFFFF')
          .padding({ left: 6, right: 6, top: 2, bottom: 2 })
          .backgroundColor(this.getStatusColor(this.payment?.status || ''))
          .borderRadius(4)
          .margin({ left: 10 })
      }
      
      Row() {
        Column() {
          Text('收款金额')
            .fontSize(12)
            .fontColor('#757575')
          
          Text(`¥${((this.payment?.amount || 0) / 10000).toFixed(1)}万`)
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .fontColor('#4CAF50')
            .margin({ top: 5 })
        }
        
        Column() {
          Text('收款日期')
            .fontSize(12)
            .fontColor('#757575')
            .margin({ left: 30 })
          
          Text(this.formatDate(this.payment?.paymentDate || ''))
            .fontSize(14)
            .fontWeight(FontWeight.Medium)
            .fontColor('#212121')
            .margin({ left: 30, top: 5 })
        }
      }
      .width('100%')
      .margin({ top: 15 })
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .margin({ bottom: 10 })
  }

  // 收款信息
  @Builder PaymentInfo() {
    Column() {
      Row() {
        Text('收款信息')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      this.InfoRow('收款方式', this.getPaymentMethod(this.payment?.paymentMethod || ''))
      this.InfoRow('关联订单', this.payment?.orderNo || '-')
      this.InfoRow('销售人员', this.payment?.salespersonName || '')
      
      if (this.payment?.status === 'verified' && this.payment?.verifiedAt) {
        this.InfoRow('核销时间', this.formatDate(this.payment.verifiedAt))
        this.InfoRow('核销人', this.payment?.verifiedBy || '')
      }
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 客户信息
  @Builder CustomerInfo() {
    Column() {
      Row() {
        Text('客户信息')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      this.InfoRow('客户名称', this.payment?.customerName || '')
    }
    .backgroundColor('#FFFFFF')
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
    .padding({ left: 20, right: 20, top: 15, bottom: 15 })
  }

  // 备注信息
  @Builder RemarkSection() {
    Column() {
      Row() {
        Text('备注')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      Text(this.payment.remark)
        .fontSize(14)
        .fontColor('#757575')
        .padding({ left: 20, right: 20, bottom: 15 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 底部操作栏
  @Builder BottomBar() {
    Row() {
      if (this.payment?.status === 'pending') {
        Button('确认收款')
          .width('48%')
          .height(45)
          .backgroundColor('#4CAF50')
          .onClick(() => {
            // TODO: 确认收款
          })
        
        Button('核销')
          .width('48%')
          .height(45)
          .backgroundColor('#1976D2')
          .margin({ left: '4%' })
          .onClick(() => {
            router.pushUrl({ url: `pages/VerifyPayment?id=${this.paymentId}` });
          })
      } else {
        Button('查看详情')
          .width('100%')
          .height(45)
          .backgroundColor('#1976D2')
      }
    }
    .width('100%')
    .height(70)
    .padding(15)
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 辅助方法
  getStatusBadge(status: string): string {
    const badges: Record<string, string> = {
      'pending': '待确认',
      'confirmed': '已确认',
      'verified': '已核销',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'pending': '#FF9800',
      'confirmed': '#2196F3',
      'verified': '#4CAF50',
    };
    return colors[status] || '#9E9E9E';
  }

  getPaymentMethod(method: string): string {
    const methods: Record<string, string> = {
      'bank_transfer': '银行转账',
      'cash': '现金',
      'check': '支票',
      'wechat': '微信',
      'alipay': '支付宝',
    };
    return methods[method] || method;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
