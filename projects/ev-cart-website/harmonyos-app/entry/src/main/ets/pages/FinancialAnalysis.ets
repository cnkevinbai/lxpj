/**
 * 财务分析页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

@Entry
@Component
struct FinancialAnalysis {
  @State analysisData: {
    revenue: number;
    cost: number;
    profit: number;
    profitRate: number;
    receivables: number;
    payables: number;
    cashFlow: number;
    trendData: Array<{ month: string; revenue: number; cost: number; profit: number }>;
  } | null = null;
  @State isLoading: boolean = true;
  @State selectedPeriod: string = 'month';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadAnalysis();
  }

  async loadAnalysis(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/financial/analysis', {
        period: this.selectedPeriod,
      });
      this.analysisData = data;
    } catch (error) {
      console.error('加载财务分析失败', error);
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
      } else if (this.analysisData) {
        // 财务概览
        this.FinancialOverview()
        
        // 收支趋势
        this.RevenueCostTrend()
        
        // 应收应付
        this.ReceivablesPayables()
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  // 顶部导航
  @Builder Header() {
    Row() {
      Text('财务分析')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 导出按钮
      Text('导出')
        .fontSize(14)
        .fontColor('#1976D2')
        .onClick(() => {
          // TODO: 导出报表
        })
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
      .padding({ left: 20, right: 20, top: 8, bottom: 8 })
      .backgroundColor(this.selectedPeriod === value ? '#1976D2' : '#F5F5F5')
      .borderRadius(20)
      .margin({ right: 10 })
      .onClick(() => {
        this.selectedPeriod = value;
        this.loadAnalysis();
      })
  }

  // 财务概览
  @Builder FinancialOverview() {
    Column() {
      Row() {
        Text('财务概览')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      Row() {
        // 收入
        Column() {
          Text('¥' + ((this.analysisData?.revenue || 0) / 10000).toFixed(1) + '万')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#4CAF50')
          
          Text('收入')
            .fontSize(12)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .width('25%')
        
        // 成本
        Column() {
          Text('¥' + ((this.analysisData?.cost || 0) / 10000).toFixed(1) + '万')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text('成本')
            .fontSize(12)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .width('25%')
        
        // 利润
        Column() {
          Text('¥' + ((this.analysisData?.profit || 0) / 10000).toFixed(1) + '万')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#2196F3')
          
          Text('利润')
            .fontSize(12)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .width('25%')
        
        // 利润率
        Column() {
          Text((this.analysisData?.profitRate || 0).toFixed(1) + '%')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#4CAF50')
          
          Text('利润率')
            .fontSize(12)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .width('25%')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 10, bottom: 20 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 收支趋势
  @Builder RevenueCostTrend() {
    Column() {
      Row() {
        Text('收支趋势')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      // 趋势图占位
      Column() {
        ForEach(this.analysisData?.trendData || [], (item) => {
          Row() {
            Text(item.month)
              .fontSize(12)
              .fontColor('#757575')
              .width(50)
            
            Row() {
              Row() {
                BackgroundColor('#4CAF50')
                  .width(`${(item.revenue / 1000000) * 100}%`)
                  .height(6)
                  .borderRadius(3)
              }
              
              BackgroundColor('#E0E0E0')
                .width(`${100 - (item.revenue / 1000000) * 100}%`)
                .height(6)
                .borderRadius(3)
            }
            .layoutWeight(1)
            .margin({ left: 10 })
            
            Text('¥' + (item.revenue / 10000).toFixed(0) + '万')
              .fontSize(11)
              .fontColor('#4CAF50')
              .width(60)
              .textAlign(TextAlign.End)
          }
          .width('100%')
          .padding({ top: 8, bottom: 8 })
        })
      }
      .width('100%')
      .padding({ left: 20, right: 20, bottom: 20 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 应收应付
  @Builder ReceivablesPayables() {
    Column() {
      Row() {
        Text('应收应付')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      Row() {
        // 应收
        Column() {
          Text('¥' + ((this.analysisData?.receivables || 0) / 10000).toFixed(1) + '万')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text('应收账款')
            .fontSize(12)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .width('50%')
        
        // 应付
        Column() {
          Text('¥' + ((this.analysisData?.payables || 0) / 10000).toFixed(1) + '万')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#F44336')
          
          Text('应付账款')
            .fontSize(12)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .width('50%')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 10, bottom: 20 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }
}
