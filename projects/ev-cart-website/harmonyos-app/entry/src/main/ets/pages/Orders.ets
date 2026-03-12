/**
 * 订单管理页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
  deliveryDate?: string;
}

@Entry
@Component
struct Orders {
  @State orders: Order[] = [];
  @State isLoading: boolean = true;
  @State selectedStatus: string = 'all';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadOrders();
  }

  async loadOrders(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/orders', {
        page: 1,
        limit: 20,
        status: this.selectedStatus === 'all' ? '' : this.selectedStatus,
      });
      this.orders = data.items;
    } catch (error) {
      console.error('加载订单列表失败', error);
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
      
      // 订单列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.orders, (order: Order) => {
            this.OrderItem(order)
          })
        }
        .width('100%')
        .layoutWeight(1)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  // 顶部导航
  @Builder Header() {
    Row() {
      Text('订单管理')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 统计
      Text(`共${this.orders.length}单`)
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
        this.StatusItem('生产中', 'producing')
        this.StatusItem('已完成', 'completed')
        this.StatusItem('已取消', 'cancelled')
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
        this.loadOrders();
      })
  }

  // 订单项
  @Builder OrderItem(order: Order) {
    Column() {
      Row() {
        Column() {
          Text('📋')
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#E3F2FD')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(order.orderNo)
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(this.getStatusBadge(order.status))
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.getStatusColor(order.status))
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(order.customerName)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(`¥${(order.totalAmount / 10000).toFixed(1)}万`)
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text(`已付¥${(order.paidAmount / 10000).toFixed(1)}万`)
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
        Text(`下单：${this.formatDate(order.createdAt)}`)
          .fontSize(12)
          .fontColor('#757575')
        
        Blank()
        
        if (order.deliveryDate) {
          Text(`交货：${this.formatDate(order.deliveryDate)}`)
            .fontSize(12)
            .fontColor('#757575')
            .margin({ left: 15 })
        }
        
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .margin({ left: 15 })
          .onClick(() => {
            router.pushUrl({ url: `pages/OrderDetail?id=${order.id}` });
          })
      }
      .width('100%')
      .padding({ left: 15, right: 15, top: 10, bottom: 15 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
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
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}
