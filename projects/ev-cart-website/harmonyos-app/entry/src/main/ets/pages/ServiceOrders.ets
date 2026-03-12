/**
 * 售后服务单页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface ServiceOrder {
  id: string;
  orderNo: string;
  customerName: string;
  serviceType: string;
  status: string;
  priority: string;
  createdAt: string;
  engineerName?: string;
}

@Entry
@Component
struct ServiceOrders {
  @State serviceOrders: ServiceOrder[] = [];
  @State isLoading: boolean = true;
  @State selectedType: string = 'all';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadServiceOrders();
  }

  async loadServiceOrders(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/service-orders', {
        page: 1,
        limit: 20,
        type: this.selectedType === 'all' ? '' : this.selectedType,
      });
      this.serviceOrders = data.items;
    } catch (error) {
      console.error('加载服务单列表失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 类型筛选
      this.TypeFilter()
      
      // 服务单列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.serviceOrders, (order: ServiceOrder) => {
            this.ServiceOrderItem(order)
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
      Text('售后服务')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 统计
      Text(`共${this.serviceOrders.length}单`)
        .fontSize(14)
        .fontColor('#757575')
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 类型筛选
  @Builder TypeFilter() {
    Scroll() {
      Row() {
        this.TypeItem('全部', 'all')
        this.TypeItem('维修', 'repair')
        this.TypeItem('保养', 'maintenance')
        this.TypeItem('安装', 'installation')
        this.TypeItem('投诉', 'complaint')
      }
      .width('100%')
      .padding({ left: 15, right: 15 })
    }
    .width('100%')
    .height(60)
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 类型项
  @Builder TypeItem(label: string, value: string) {
    Text(label)
      .fontSize(14)
      .fontWeight(this.selectedType === value ? FontWeight.Bold : FontWeight.Normal)
      .fontColor(this.selectedType === value ? '#FFFFFF' : '#757575')
      .padding({ left: 15, right: 15, top: 8, bottom: 8 })
      .backgroundColor(this.selectedType === value ? '#1976D2' : '#F5F5F5')
      .borderRadius(20)
      .margin({ right: 10 })
      .onClick(() => {
        this.selectedType = value;
        this.loadServiceOrders();
      })
  }

  // 服务单项
  @Builder ServiceOrderItem(order: ServiceOrder) {
    Column() {
      Row() {
        Column() {
          Text(this.getServiceTypeIcon(order.serviceType))
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
            
            Text(this.getPriorityBadge(order.priority))
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.getPriorityColor(order.priority))
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(`${order.customerName} · ${this.getServiceTypeName(order.serviceType)}`)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(this.getStatusBadge(order.status))
            .fontSize(12)
            .fontColor('#FFFFFF')
            .padding({ left: 6, right: 6, top: 2, bottom: 2 })
            .backgroundColor(this.getStatusColor(order.status))
            .borderRadius(4)
          
          if (order.engineerName) {
            Text(order.engineerName)
              .fontSize(12)
              .fontColor('#757575')
              .margin({ top: 5 })
          }
        }
        .alignItems(HorizontalAlign.Center)
      }
      .width('100%')
      .padding(15)
      
      Divider().color('#E0E0E0').margin({ left: 80 })
      
      Row() {
        Text(`报修：${this.formatDate(order.createdAt)}`)
          .fontSize(12)
          .fontColor('#757575')
        
        Blank()
        
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/ServiceOrderDetail?id=${order.id}` });
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
      Button('创建服务单')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateServiceOrder' });
        })
      
      Button('服务统计')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/ServiceStatistics' });
        })
    }
    .width('100%')
    .height(70)
    .padding(15)
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 辅助方法
  getServiceTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'repair': '🔧',
      'maintenance': '🛠️',
      'installation': '📦',
      'complaint': '⚠️',
    };
    return icons[type] || '📝';
  }

  getServiceTypeName(type: string): string {
    const names: Record<string, string> = {
      'repair': '维修',
      'maintenance': '保养',
      'installation': '安装',
      'complaint': '投诉',
    };
    return names[type] || type;
  }

  getPriorityBadge(priority: string): string {
    const badges: Record<string, string> = {
      'low': '低',
      'normal': '普通',
      'high': '高',
      'urgent': '紧急',
    };
    return badges[priority] || priority;
  }

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      'low': '#9E9E9E',
      'normal': '#2196F3',
      'high': '#FF9800',
      'urgent': '#F44336',
    };
    return colors[priority] || '#9E9E9E';
  }

  getStatusBadge(status: string): string {
    const badges: Record<string, string> = {
      'pending': '待处理',
      'assigned': '已派单',
      'in_progress': '处理中',
      'completed': '已完成',
      'confirmed': '已确认',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'pending': '#FF9800',
      'assigned': '#2196F3',
      'in_progress': '#4CAF50',
      'completed': '#4CAF50',
      'confirmed': '#4CAF50',
    };
    return colors[status] || '#9E9E9E';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}
