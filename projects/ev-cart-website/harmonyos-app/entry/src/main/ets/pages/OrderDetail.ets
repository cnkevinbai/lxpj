/**
 * 订单详情页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  customerId: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  products: Array<{
    productName: string;
    productModel: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  deliveryDate: string;
  deliveryAddress: string;
  remark: string;
  createdAt: string;
  salespersonName: string;
}

@Entry
@Component
struct OrderDetail {
  @State order: Order | null = null;
  @State isLoading: boolean = true;
  
  private apiService: ApiService = new ApiService();
  private orderId: string = '';

  aboutToAppear(): void {
    const params = router.getParams() as Record<string, string>;
    this.orderId = params['id'] || '';
    this.loadOrder();
  }

  async loadOrder(): Promise<void> {
    try {
      const data = await this.apiService.get(`/mobile/orders/${this.orderId}`);
      this.order = data;
    } catch (error) {
      console.error('加载订单详情失败', error);
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
      } else if (this.order) {
        // 订单状态卡片
        this.OrderStatusCard()
        
        // 订单信息
        this.OrderInfo()
        
        // 产品列表
        this.ProductList()
        
        // 收款记录
        this.PaymentRecords()
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
      
      Text('订单详情')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .margin({ left: 15 })
      
      Blank()
      
      // 更多操作
      Image($r('sys.media.ohos_ic_public_more'))
        .width(24)
        .height(24)
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 订单状态卡片
  @Builder OrderStatusCard() {
    Column() {
      Row() {
        Text(this.order?.orderNo || '')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
        
        Text(this.getStatusBadge(this.order?.status || ''))
          .fontSize(14)
          .fontColor('#FFFFFF')
          .padding({ left: 8, right: 8, top: 4, bottom: 4 })
          .backgroundColor(this.getStatusColor(this.order?.status || ''))
          .borderRadius(4)
          .margin({ left: 10 })
      }
      
      // 进度条
      Row() {
        Row() {
          Row() {
            Text('已付')
              .fontSize(12)
              .fontColor('#757575')
            
            Text(`¥${((this.order?.paidAmount || 0) / 10000).toFixed(1)}万`)
              .fontSize(14)
              .fontWeight(FontWeight.Bold)
              .fontColor('#4CAF50')
              .margin({ left: 5 })
          }
          
          Row() {
            Text('未付')
              .fontSize(12)
              .fontColor('#757575')
              .margin({ left: 20 })
            
            Text(`¥${((this.order?.balanceAmount || 0) / 10000).toFixed(1)}万`)
              .fontSize(14)
              .fontWeight(FontWeight.Bold)
              .fontColor('#FF9800')
              .margin({ left: 5 })
          }
        }
        
        Text(`总计¥${((this.order?.totalAmount || 0) / 10000).toFixed(1)}万`)
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#1976D2')
      }
      .width('100%')
      .margin({ top: 15 })
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .margin({ bottom: 10 })
  }

  // 订单信息
  @Builder OrderInfo() {
    Column() {
      this.InfoRow('客户名称', this.order?.customerName || '')
      this.InfoRow('交货日期', this.formatDate(this.order?.deliveryDate || ''))
      this.InfoRow('交货地址', this.order?.deliveryAddress || '')
      this.InfoRow('销售人员', this.order?.salespersonName || '')
      this.InfoRow('下单时间', this.formatDate(this.order?.createdAt || ''))
      
      if (this.order?.remark) {
        this.InfoRow('备注', this.order.remark)
      }
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

  // 产品列表
  @Builder ProductList() {
    Column() {
      Row() {
        Text('产品明细')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      // 产品列表
      ForEach(this.order?.products || [], (product) => {
        Row() {
          Column() {
            Text(product.productName)
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(product.productModel)
              .fontSize(12)
              .fontColor('#757575')
              .margin({ top: 4 })
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
          
          Column() {
            Text(`¥${(product.unitPrice / 10000).toFixed(2)}万`)
              .fontSize(14)
              .fontWeight(FontWeight.Bold)
              .fontColor('#FF9800')
            
            Text(`×${product.quantity}`)
              .fontSize(12)
              .fontColor('#757575')
              .margin({ top: 4 })
          }
        }
        .width('100%')
        .padding({ left: 20, right: 20, top: 15, bottom: 15 })
      })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 收款记录
  @Builder PaymentRecords() {
    Column() {
      Row() {
        Text('收款记录')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
        
        Blank()
        
        Text('查看全部')
          .fontSize(14)
          .fontColor('#1976D2')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      Text('暂无收款记录')
        .fontSize(14)
        .fontColor('#757575')
        .margin({ top: 20, bottom: 20 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 底部操作栏
  @Builder BottomBar() {
    Row() {
      if (this.order?.status === 'pending') {
        Button('确认订单')
          .width('48%')
          .height(45)
          .backgroundColor('#4CAF50')
      } else if (this.order?.status === 'confirmed') {
        Button('安排生产')
          .width('48%')
          .height(45)
          .backgroundColor('#1976D2')
      } else {
        Button('查看生产')
          .width('48%')
          .height(45)
          .backgroundColor('#1976D2')
      }
      
      Button('收款')
        .width('48%')
        .height(45)
        .backgroundColor('#FF9800')
        .margin({ left: '4%' })
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
      'producing': '生产中',
      'completed': '已完成',
      'cancelled': '已取消',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'pending': '#FF9800',
      'confirmed': '#2196F3',
      'producing': '#4CAF50',
      'completed': '#4CAF50',
      'cancelled': '#9E9E9E',
    };
    return colors[status] || '#9E9E9E';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
