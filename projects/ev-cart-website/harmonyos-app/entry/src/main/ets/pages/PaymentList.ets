/**
 * 收款列表页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface Payment {
  id: string;
  paymentNo: string;
  customerName: string;
  customerId: string;
  orderNo?: string;
  amount: number;
  paymentMethod: string;
  status: string;
  paymentDate: string;
  createdAt: string;
  salespersonName: string;
}

@Entry
@Component
struct PaymentList {
  @State payments: Payment[] = [];
  @State isLoading: boolean = true;
  @State selectedStatus: string = 'all';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadPayments();
  }

  async loadPayments(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/payments', {
        page: 1,
        limit: 20,
        status: this.selectedStatus === 'all' ? '' : this.selectedStatus,
      });
      this.payments = data.items;
    } catch (error) {
      console.error('加载收款列表失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 状态筛选
      this.StatusFilter()
      
      // 收款列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.payments, (payment) => {
            this.PaymentItem(payment)
          })
        }
        .width('100%')
        .layoutWeight(1)
      }
      
      // 底部按钮
      this.BottomBar()
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  // 顶部导航
  @Builder Header() {
    Row() {
      Text('收款管理')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 统计
      Text(`共${this.payments.length}笔`)
        .fontSize(14)
        .fontColor('#757575')
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 状态筛选
  @Builder StatusFilter() {
    Scroll() {
      Row() {
        this.StatusItem('全部', 'all')
        this.StatusItem('待确认', 'pending')
        this.StatusItem('已确认', 'confirmed')
        this.StatusItem('已核销', 'verified')
      }
      .width('100%')
      .padding({ left: 15, right: 15 })
    }
    .width('100%')
    .height(60)
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 状态项
  @Builder StatusItem(label: string, value: string) {
    Text(label)
      .fontSize(14)
      .fontWeight(this.selectedStatus === value ? FontWeight.Bold : FontWeight.Normal)
      .fontColor(this.selectedStatus === value ? '#FFFFFF' : '#757575')
      .padding({ left: 15, right: 15, top: 8, bottom: 8 })
      .backgroundColor(this.selectedStatus === value ? '#1976D2' : '#F5F5F5')
      .borderRadius(20)
      .margin({ right: 10 })
      .onClick(() => {
        this.selectedStatus = value;
        this.loadPayments();
      })
  }

  // 收款项
  @Builder PaymentItem(payment: Payment) {
    Column() {
      Row() {
        Column() {
          Text('💵')
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#E8F5E9')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(payment.paymentNo)
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(this.getStatusBadge(payment.status))
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.getStatusColor(payment.status))
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(payment.customerName)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
          
          if (payment.orderNo) {
            Text(`订单：${payment.orderNo}`)
              .fontSize(12)
              .fontColor('#9E9E9E')
              .margin({ top: 3 })
          }
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(`¥${(payment.amount / 10000).toFixed(1)}万`)
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor('#4CAF50')
          
          Text(this.getPaymentMethod(payment.paymentMethod))
            .fontSize(12)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Center)
      }
      .width('100%')
      .padding(15)
      
      Divider().color('#E0E0E0').margin({ left: 80 })
      
      Row() {
        Text(`收款：${this.formatDate(payment.paymentDate)}`)
          .fontSize(12)
          .fontColor('#757575')
        
        Blank()
        
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/PaymentDetail?id=${payment.id}` });
          })
      }
      .width('100%')
      .padding({ left: 15, right: 15, top: 10, bottom: 15 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 底部按钮
  @Builder BottomBar() {
    Row() {
      Button('登记收款')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreatePayment' });
        })
      
      Button('收款统计')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/PaymentStatistics' });
        })
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
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}
