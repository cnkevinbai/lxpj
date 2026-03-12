/**
 * 配件领用列表页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface ServicePartUse {
  id: string;
  useNo: string;
  serviceOrderNo: string;
  customerName: string;
  partName: string;
  partCode: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: string;
  usedDate: string;
  userName: string;
}

@Entry
@Component
struct ServicePartUseList {
  @State partUses: ServicePartUse[] = [];
  @State isLoading: boolean = true;
  @State selectedStatus: string = 'all';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadPartUses();
  }

  async loadPartUses(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/service-part-uses', {
        page: 1,
        limit: 20,
        status: this.selectedStatus === 'all' ? '' : this.selectedStatus,
      });
      this.partUses = data.items;
    } catch (error) {
      console.error('加载配件领用失败', error);
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
      
      // 配件领用列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.partUses, (partUse) => {
            this.PartUseItem(partUse)
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
      Text('配件领用')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 统计
      Text(`共${this.partUses.length}个`)
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
        this.StatusItem('已领用', 'used')
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
        this.loadPartUses();
      })
  }

  // 配件领用项
  @Builder PartUseItem(partUse: ServicePartUse) {
    Column() {
      Row() {
        Column() {
          Text('🔧')
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#FFF3E0')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(partUse.useNo)
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(this.getStatusBadge(partUse.status))
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.getStatusColor(partUse.status))
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(`${partUse.partName} (${partUse.partCode})`)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
          
          Text(`工单：${partUse.serviceOrderNo} · ${partUse.customerName}`)
            .fontSize(12)
            .fontColor('#9E9E9E')
            .margin({ top: 3 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text('¥' + (partUse.totalAmount / 10000).toFixed(2) + '万')
            .fontSize(14)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text(`${partUse.quantity} × ${(partUse.unitPrice / 10000).toFixed(2)}万`)
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
        Text(`领用：${this.formatDate(partUse.usedDate)}`)
          .fontSize(12)
          .fontColor('#757575')
        
        Text(` · ${partUse.userName}`)
          .fontSize(12)
          .fontColor('#757575')
        
        Blank()
        
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/ServicePartUseDetail?id=${partUse.id}` });
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
      Button('领用配件')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateServicePartUse' });
        })
      
      Button('领用统计')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/ServicePartUseStatistics' });
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
      'used': '已领用',
      'verified': '已核销',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'used': '#2196F3',
      'verified': '#4CAF50',
    };
    return colors[status] || '#9E9E9E';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}
