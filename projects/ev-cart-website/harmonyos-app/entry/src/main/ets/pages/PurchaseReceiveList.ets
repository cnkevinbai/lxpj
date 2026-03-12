/**
 * 采购收货列表页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface PurchaseReceive {
  id: string;
  receiveNo: string;
  orderNo: string;
  supplierName: string;
  totalQuantity: number;
  receivedQuantity: number;
  status: string;
  receiveDate: string;
  receiverName: string;
}

@Entry
@Component
struct PurchaseReceiveList {
  @State receives: PurchaseReceive[] = [];
  @State isLoading: boolean = true;
  @State selectedStatus: string = 'all';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadReceives();
  }

  async loadReceives(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/purchase-receives', {
        page: 1,
        limit: 20,
        status: this.selectedStatus === 'all' ? '' : this.selectedStatus,
      });
      this.receives = data.items;
    } catch (error) {
      console.error('加载采购收货失败', error);
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
      
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.receives, (receive) => {
            this.ReceiveItem(receive)
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
      Text('采购收货')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      Text(`共${this.receives.length}个`)
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
        this.StatusItem('待收货', 'pending')
        this.StatusItem('部分收货', 'partial')
        this.StatusItem('已完成', 'completed')
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
        this.loadReceives();
      })
  }

  // 收货项
  @Builder ReceiveItem(receive: PurchaseReceive) {
    Column() {
      Row() {
        Column() {
          Text('📦')
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#E3F2FD')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(receive.receiveNo)
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(this.getStatusBadge(receive.status))
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.getStatusColor(receive.status))
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(receive.supplierName)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
          
          Text(`订单：${receive.orderNo}`)
            .fontSize(12)
            .fontColor('#9E9E9E')
            .margin({ top: 3 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(`${receive.receivedQuantity}/${receive.totalQuantity}`)
            .fontSize(14)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text('已收/总数')
            .fontSize(11)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Center)
      }
      .width('100%')
      .padding(15)
      
      Divider().color('#E0E0E0').margin({ left: 80 })
      
      Row() {
        Text(`收货：${this.formatDate(receive.receiveDate)}`)
          .fontSize(12)
          .fontColor('#757575')
        
        Blank()
        
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/PurchaseReceiveDetail?id=${receive.id}` });
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
      Button('登记收货')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreatePurchaseReceive' });
        })
      
      Button('收货统计')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/PurchaseReceiveStatistics' });
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
      'pending': '待收货',
      'partial': '部分收货',
      'completed': '已完成',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'pending': '#FF9800',
      'partial': '#2196F3',
      'completed': '#4CAF50',
    };
    return colors[status] || '#9E9E9E';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}
