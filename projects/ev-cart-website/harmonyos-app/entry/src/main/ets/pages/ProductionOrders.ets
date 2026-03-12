/**
 * 生产工单管理页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface ProductionOrder {
  id: string;
  orderNo: string;
  productName: string;
  productModel: string;
  quantity: number;
  completedQuantity: number;
  status: string;
  priority: string;
  planStartDate: string;
  planEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  workshopName?: string;
  lineName?: string;
  progress: number;
}

@Entry
@Component
struct ProductionOrders {
  @State productionOrders: ProductionOrder[] = [];
  @State isLoading: boolean = true;
  @State selectedStatus: string = 'all';
  @State searchKeyword: string = '';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadProductionOrders();
  }

  async loadProductionOrders(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/production-orders', {
        page: 1,
        limit: 20,
        status: this.selectedStatus === 'all' ? '' : this.selectedStatus,
        keyword: this.searchKeyword,
      });
      this.productionOrders = data.items;
    } catch (error) {
      console.error('加载生产工单失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 搜索栏
      this.SearchBar()
      
      // 状态筛选
      this.StatusFilter()
      
      // 工单列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.productionOrders, (order: ProductionOrder) => {
            this.ProductionOrderItem(order)
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
      Text('生产工单')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 统计
      Text(`共${this.productionOrders.length}单`)
        .fontSize(14)
        .fontColor('#757575')
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 搜索栏
  @Builder SearchBar() {
    Row() {
      Image($r('sys.media.ohos_ic_public_search'))
        .width(20)
        .height(20)
        .fillColor('#9E9E9E')
      
      TextInput({ placeholder: '搜索工单号/产品名称', text: this.searchKeyword })
        .width('100%')
        .height(40)
        .backgroundColor('#F5F5F5')
        .borderRadius(20)
        .padding({ left: 10, right: 10 })
        .onChange((value: string) => {
          this.searchKeyword = value;
        })
    }
    .width('100%')
    .padding({ left: 15, right: 15, top: 10 })
  }

  // 状态筛选
  @Builder StatusFilter() {
    Scroll() {
      Row() {
        this.StatusItem('全部', 'all')
        this.StatusItem('待计划', 'pending')
        this.StatusItem('已计划', 'planned')
        this.StatusItem('已下达', 'released')
        this.StatusItem('生产中', 'in_progress')
        this.StatusItem('已完成', 'completed')
      }
      .width('100%')
      .padding({ left: 15, right: 15, top: 10 })
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
        this.loadProductionOrders();
      })
  }

  // 工单项
  @Builder ProductionOrderItem(order: ProductionOrder) {
    Column() {
      Row() {
        Column() {
          Text('🏭')
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
          
          Text(`${order.productName} ${order.productModel}`)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
          
          // 进度条
          Row() {
            Row() {
              Row() {
                Text('进度')
                  .fontSize(12)
                  .fontColor('#757575')
                
                Text(`${order.progress}%`)
                  .fontSize(12)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('#1976D2')
                  .margin({ left: 5 })
              }
              .width(60)
            }
            
            Row() {
              BackgroundColor('#E0E0E0')
                .width(100)
                .height(6)
                .borderRadius(3)
              
              Row() {
                BackgroundColor('#1976D2')
                  .width(`${order.progress}%`)
                  .height(6)
                  .borderRadius(3)
              }
              .width(`${order.progress}%`)
            }
            .margin({ left: 10 })
          }
          .margin({ top: 8 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(`${order.completedQuantity}/${order.quantity}`)
            .fontSize(14)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text('件')
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
        Column() {
          Text(`计划：${this.formatDate(order.planStartDate)} - ${this.formatDate(order.planEndDate)}`)
            .fontSize(12)
            .fontColor('#757575')
          
          if (order.workshopName) {
            Text(`${order.workshopName} ${order.lineName || ''}`)
              .fontSize(12)
              .fontColor('#757575')
              .margin({ top: 3 })
          }
        }
        
        Blank()
        
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/ProductionOrderDetail?id=${order.id}` });
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
      Button('新建工单')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateProductionOrder' });
        })
      
      Button('生产统计')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/ProductionStatistics' });
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
      'pending': '待计划',
      'planned': '已计划',
      'released': '已下达',
      'in_progress': '生产中',
      'completed': '已完成',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'pending': '#9E9E9E',
      'planned': '#2196F3',
      'released': '#4CAF50',
      'in_progress': '#4CAF50',
      'completed': '#4CAF50',
    };
    return colors[status] || '#9E9E9E';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}
