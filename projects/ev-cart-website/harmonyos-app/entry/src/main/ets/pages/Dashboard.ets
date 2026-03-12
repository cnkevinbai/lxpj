/**
 * 数据看板页面
 * 销售业绩/生产统计/回款统计
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

@Entry
@Component
struct Dashboard {
  @State salesData: any = {};
  @State productionData: any = {};
  @State collectionData: any = {};
  @State isLoading: boolean = true;
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    try {
      const [sales, production, collection] = await Promise.all([
        this.apiService.get('/mobile/dashboard/sales'),
        this.apiService.get('/mobile/dashboard/production'),
        this.apiService.get('/mobile/dashboard/collection')
      ]);
      
      this.salesData = sales;
      this.productionData = production;
      this.collectionData = collection;
    } catch (error) {
      console.error('加载数据看板失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 内容区域
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        Scroll() {
          Column() {
            // 销售业绩
            this.SalesCard()
            
            // 生产统计
            this.ProductionCard()
            
            // 回款统计
            this.CollectionCard()
            
            // 快捷入口
            this.QuickActions()
          }
          .width('100%')
          .padding(15)
        }
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
      Text('数据看板')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 刷新按钮
      Image($r('sys.media.ohos_ic_public_refresh'))
        .width(24)
        .height(24)
        .onClick(() => {
          this.loadDashboardData();
        })
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 销售业绩卡片
  @Builder SalesCard() {
    Column() {
      Row() {
        Text('销售业绩')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
        
        Blank()
        
        Text(`本月目标：¥${(this.salesData.target / 10000).toFixed(0)}万`)
          .fontSize(13)
          .fontColor('#757575')
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 进度条
      Column() {
        Row() {
          Text(`¥${(this.salesData.completed / 10000).toFixed(1)}万`)
            .fontSize(28)
            .fontWeight(FontWeight.Bold)
            .fontColor('#1976D2')
          
          Text(`/ ¥${(this.salesData.target / 10000).toFixed(1)}万`)
            .fontSize(16)
            .fontColor('#757575')
            .margin({ left: 10 })
        }
        .width('100%')
        .margin({ bottom: 10 })
        
        Progress({ value: this.salesData.rate || 0, total: 100 })
          .width('100%')
          .height(10)
          .color('#1976D2')
      }
      .width('100%')
      
      // 统计
      Row() {
        this.StatItem('订单数', this.salesData.orderCount || 0)
        this.StatItem('完成率', `${this.salesData.rate || 0}%`)
        this.StatItem('排名', `第${this.salesData.rank || 0}名`)
      }
      .width('100%')
      .margin({ top: 15 })
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 生产统计卡片
  @Builder ProductionCard() {
    Column() {
      Row() {
        Text('生产统计')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
        
        Blank()
        
        Text(`本月计划：${this.productionData.planQuantity || 0}台`)
          .fontSize(13)
          .fontColor('#757575')
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 进度条
      Column() {
        Row() {
          Text(`${this.productionData.completedQuantity || 0}台`)
            .fontSize(28)
            .fontWeight(FontWeight.Bold)
            .fontColor('#4CAF50')
          
          Text(`/ ${this.productionData.planQuantity || 0}台`)
            .fontSize(16)
            .fontColor('#757575')
            .margin({ left: 10 })
        }
        .width('100%')
        .margin({ bottom: 10 })
        
        Progress({ value: this.productionData.completionRate || 0, total: 100 })
          .width('100%')
          .height(10)
          .color('#4CAF50')
      }
      .width('100%')
      
      // 统计
      Row() {
        this.StatItem('合格率', `${this.productionData.qualityRate || 0}%`)
        this.StatItem('在制', `${this.productionData.wip || 0}台`)
        this.StatItem('延期', `${this.productionData.overdue || 0}台`)
      }
      .width('100%')
      .margin({ top: 15 })
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 回款统计卡片
  @Builder CollectionCard() {
    Column() {
      Row() {
        Text('回款统计')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
        
        Blank()
        
        Text(`本月应收：¥${(this.collectionData.receivable / 10000).toFixed(0)}万`)
          .fontSize(13)
          .fontColor('#757575')
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 进度条
      Column() {
        Row() {
          Text(`¥${(this.collectionData.collected / 10000).toFixed(1)}万`)
            .fontSize(28)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text(`/ ¥${(this.collectionData.receivable / 10000).toFixed(1)}万`)
            .fontSize(16)
            .fontColor('#757575')
            .margin({ left: 10 })
        }
        .width('100%')
        .margin({ bottom: 10 })
        
        Progress({ value: this.collectionData.rate || 0, total: 100 })
          .width('100%')
          .height(10)
          .color('#FF9800')
      }
      .width('100%')
      
      // 统计
      Row() {
        this.StatItem('回款率', `${this.collectionData.rate || 0}%`)
        this.StatItem('逾期', `¥${(this.collectionData.overdue / 10000).toFixed(1)}万`)
        this.StatItem('账期', `${this.collectionData.avgDays || 0}天`)
      }
      .width('100%')
      .margin({ top: 15 })
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 统计项
  @Builder StatItem(label: string, value: string | number) {
    Column() {
      Text(value.toString())
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Text(label)
        .fontSize(12)
        .fontColor('#757575')
        .margin({ top: 5 })
    }
    .width('33%')
    .alignItems(HorizontalAlign.Center)
  }

  // 快捷入口
  @Builder QuickActions() {
    Column() {
      Text('快捷入口')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      Row() {
        this.QuickActionItem('客户', '👥', () => {
          router.pushUrl({ url: 'pages/Customers' });
        })
        
        this.QuickActionItem('订单', '📋', () => {
          router.pushUrl({ url: 'pages/Orders' });
        })
        
        this.QuickActionItem('审批', '✅', () => {
          router.pushUrl({ url: 'pages/Approvals' });
        })
        
        this.QuickActionItem('服务', '🔧', () => {
          router.pushUrl({ url: 'pages/ServiceOrders' });
        })
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceEvenly)
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
  }

  // 快捷入口项
  @Builder QuickActionItem(icon: string, label: string, onClick: () => void) {
    Column() {
      Text(icon)
        .fontSize(32)
        .margin({ bottom: 8 })
      
      Text(label)
        .fontSize(14)
        .fontColor('#212121')
    }
    .width(80)
    .onClick(onClick)
  }
}
