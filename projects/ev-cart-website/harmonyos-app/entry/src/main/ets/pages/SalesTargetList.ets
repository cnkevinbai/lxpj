/**
 * 销售目标列表页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface SalesTarget {
  id: string;
  targetNo: string;
  salespersonName: string;
  period: string;
  targetAmount: number;
  actualAmount: number;
  achievementRate: number;
  status: string;
}

@Entry
@Component
struct SalesTargetList {
  @State targets: SalesTarget[] = [];
  @State isLoading: boolean = true;
  @State selectedPeriod: string = 'month';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadTargets();
  }

  async loadTargets(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/sales-targets', {
        period: this.selectedPeriod,
      });
      this.targets = data.items;
    } catch (error) {
      console.error('加载销售目标失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 周期筛选
      this.PeriodFilter()
      
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.targets, (target) => {
            this.TargetItem(target)
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
      Text('销售目标')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      Text(`共${this.targets.length}个`)
        .fontSize(14)
        .fontColor('#757575')
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 周期筛选
  @Builder PeriodFilter() {
    Scroll() {
      Row() {
        this.PeriodItem('本周', 'week')
        this.PeriodItem('本月', 'month')
        this.PeriodItem('本季', 'quarter')
        this.PeriodItem('本年', 'year')
      }
      .width('100%')
      .padding({ left: 15, right: 15 })
    }
    .width('100%')
    .height(60)
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 周期项
  @Builder PeriodItem(label: string, value: string) {
    Text(label)
      .fontSize(14)
      .fontWeight(this.selectedPeriod === value ? FontWeight.Bold : FontWeight.Normal)
      .fontColor(this.selectedPeriod === value ? '#FFFFFF' : '#757575')
      .padding({ left: 15, right: 15, top: 8, bottom: 8 })
      .backgroundColor(this.selectedPeriod === value ? '#1976D2' : '#F5F5F5')
      .borderRadius(20)
      .margin({ right: 10 })
      .onClick(() => {
        this.selectedPeriod = value;
        this.loadTargets();
      })
  }

  // 目标项
  @Builder TargetItem(target: SalesTarget) {
    Column() {
      Row() {
        Column() {
          Text('🎯')
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#E3F2FD')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(target.salespersonName)
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(this.getStatusBadge(target.status))
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.getStatusColor(target.status))
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(`${target.period} · 目标¥${(target.targetAmount / 10000).toFixed(1)}万`)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
          
          // 进度条
          Row() {
            Row() {
              BackgroundColor(target.achievementRate >= 100 ? '#4CAF50' : '#1976D2')
                .width(`${Math.min(target.achievementRate, 100)}%`)
                .height(6)
                .borderRadius(3)
            }
            
            BackgroundColor('#E0E0E0')
              .width(`${100 - Math.min(target.achievementRate, 100)}%`)
              .height(6)
              .borderRadius(3)
          }
          .width(150)
          .margin({ top: 8 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(`¥${(target.actualAmount / 10000).toFixed(1)}万`)
            .fontSize(14)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text(`${target.achievementRate.toFixed(1)}%`)
            .fontSize(12)
            .fontColor(target.achievementRate >= 100 ? '#4CAF50' : '#757575')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Center)
      }
      .width('100%')
      .padding(15)
      
      Divider().color('#E0E0E0').margin({ left: 80 })
      
      Row() {
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/SalesTargetDetail?id=${target.id}` });
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
      Button('设定目标')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateSalesTarget' });
        })
      
      Button('目标统计')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/SalesTargetStatistics' });
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
      'in_progress': '进行中',
      'completed': '已完成',
      'overdue': '已逾期',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'in_progress': '#1976D2',
      'completed': '#4CAF50',
      'overdue': '#F44336',
    };
    return colors[status] || '#9E9E9E';
  }
}
