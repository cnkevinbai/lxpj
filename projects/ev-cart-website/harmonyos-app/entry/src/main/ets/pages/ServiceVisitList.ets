/**
 * 服务回访列表页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface ServiceVisit {
  id: string;
  visitNo: string;
  customerName: string;
  serviceOrderNo: string;
  visitType: string;
  visitMethod: string;
  satisfactionScore: number;
  status: string;
  visitDate: string;
  visitorName: string;
}

@Entry
@Component
struct ServiceVisitList {
  @State visits: ServiceVisit[] = [];
  @State isLoading: boolean = true;
  @State selectedStatus: string = 'all';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadVisits();
  }

  async loadVisits(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/service-visits', {
        page: 1,
        limit: 20,
        status: this.selectedStatus === 'all' ? '' : this.selectedStatus,
      });
      this.visits = data.items;
    } catch (error) {
      console.error('加载服务回访失败', error);
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
      
      // 回访列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.visits, (visit) => {
            this.VisitItem(visit)
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
      Text('服务回访')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 统计
      Text(`共${this.visits.length}个`)
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
        this.StatusItem('待回访', 'pending')
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
        this.loadVisits();
      })
  }

  // 回访项
  @Builder VisitItem(visit: ServiceVisit) {
    Column() {
      Row() {
        Column() {
          Text('📞')
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#E3F2FD')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(visit.visitNo)
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(this.getStatusBadge(visit.status))
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.getStatusColor(visit.status))
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(visit.customerName)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
          
          Text(`${visit.visitType} · ${visit.visitMethod}`)
            .fontSize(12)
            .fontColor('#9E9E9E')
            .margin({ top: 3 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          // 满意度星级
          Row() {
            ForEach(Array.from({ length: 5 }), (_, index) => {
              Text(index < (visit.satisfactionScore || 0) ? '⭐' : '☆')
                .fontSize(12)
            })
          }
          
          Text(visit.visitorName)
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
        Text(`回访：${this.formatDate(visit.visitDate)}`)
          .fontSize(12)
          .fontColor('#757575')
        
        Blank()
        
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/ServiceVisitDetail?id=${visit.id}` });
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
      Button('创建回访')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateServiceVisit' });
        })
      
      Button('回访统计')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/ServiceVisitStatistics' });
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
      'pending': '待回访',
      'completed': '已完成',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'pending': '#FF9800',
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
