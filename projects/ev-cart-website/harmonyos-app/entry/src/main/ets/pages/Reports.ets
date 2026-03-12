/**
 * 报表中心页面
 * 销售报表/生产报表/财务报表
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

@Entry
@Component
struct Reports {
  @State salesReport: any = {};
  @State productionReport: any = {};
  @State financialReport: any = {};
  @State selectedPeriod: string = 'month';
  @State isLoading: boolean = true;
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadReports();
  }

  async loadReports(): Promise<void> {
    try {
      const [sales, production, financial] = await Promise.all([
        this.apiService.get('/mobile/reports/sales', { period: this.selectedPeriod }),
        this.apiService.get('/mobile/reports/production', { period: this.selectedPeriod }),
        this.apiService.get('/mobile/reports/financial', { period: this.selectedPeriod })
      ]);
      
      this.salesReport = sales;
      this.productionReport = production;
      this.financialReport = financial;
    } catch (error) {
      console.error('加载报表失败', error);
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
            // 销售报表
            this.SalesReportCard()
            
            // 生产报表
            this.ProductionReportCard()
            
            // 财务报表
            this.FinancialReportCard()
            
            // 导出按钮
            this.ExportButtons()
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
      Text('报表中心')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 周期选择
      Picker({
        options: [
          { value: 'week', label: '本周' },
          { value: 'month', label: '本月' },
          { value: 'quarter', label: '本季' },
          { value: 'year', label: '本年' }
        ],
        selected: this.selectedPeriod
      })
      .onChange((value: string) => {
        this.selectedPeriod = value;
        this.loadReports();
      })
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 销售报表卡片
  @Builder SalesReportCard() {
    Column() {
      Row() {
        Text('销售报表')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
        
        Blank()
        
        Text('查看详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: 'pages/SalesReportDetail' });
          })
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 销售数据
      Row() {
        this.ReportStatItem('销售额', `${(this.salesReport.totalSales / 10000).toFixed(1)}万`, '#1976D2')
        this.ReportStatItem('订单数', this.salesReport.orderCount || 0, '#4CAF50')
        this.ReportStatItem('完成率', `${this.salesReport.completionRate || 0}%`, '#FF9800')
      }
      .width('100%')
      
      // 趋势图占位
      Column() {
        Text('销售趋势图')
          .fontSize(14)
          .fontColor('#757575')
          .margin({ top: 20 })
      }
      .width('100%')
      .height(200)
      .backgroundColor('#F5F5F5')
      .borderRadius(8)
      .justifyContent(FlexAlign.Center)
      .margin({ top: 15 })
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 生产报表卡片
  @Builder ProductionReportCard() {
    Column() {
      Row() {
        Text('生产报表')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
        
        Blank()
        
        Text('查看详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: 'pages/ProductionReportDetail' });
          })
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 生产数据
      Row() {
        this.ReportStatItem('产量', `${this.productionReport.output || 0}台`, '#4CAF50')
        this.ReportStatItem('合格率', `${this.productionReport.qualityRate || 0}%`, '#2196F3')
        this.ReportStatItem('在制', `${this.productionReport.wip || 0}台`, '#FF9800')
      }
      .width('100%')
      
      // 趋势图占位
      Column() {
        Text('生产趋势图')
          .fontSize(14)
          .fontColor('#757575')
          .margin({ top: 20 })
      }
      .width('100%')
      .height(200)
      .backgroundColor('#F5F5F5')
      .borderRadius(8)
      .justifyContent(FlexAlign.Center)
      .margin({ top: 15 })
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 财务报表卡片
  @Builder FinancialReportCard() {
    Column() {
      Row() {
        Text('财务报表')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
        
        Blank()
        
        Text('查看详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: 'pages/FinancialReportDetail' });
          })
      }
      .width('100%')
      .margin({ bottom: 15 })
      
      // 财务数据
      Row() {
        this.ReportStatItem('回款', `${(this.financialReport.collection / 10000).toFixed(1)}万`, '#FF9800')
        this.ReportStatItem('应收', `${(this.financialReport.receivable / 10000).toFixed(1)}万`, '#F44336')
        this.ReportStatItem('回款率', `${this.financialReport.collectionRate || 0}%`, '#4CAF50')
      }
      .width('100%')
      
      // 趋势图占位
      Column() {
        Text('回款趋势图')
          .fontSize(14)
          .fontColor('#757575')
          .margin({ top: 20 })
      }
      .width('100%')
      .height(200)
      .backgroundColor('#F5F5F5')
      .borderRadius(8)
      .justifyContent(FlexAlign.Center)
      .margin({ top: 15 })
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 报表统计项
  @Builder ReportStatItem(label: string, value: string | number, color: string) {
    Column() {
      Text(value.toString())
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor(color)
      
      Text(label)
        .fontSize(12)
        .fontColor('#757575')
        .margin({ top: 5 })
    }
    .width('33%')
    .alignItems(HorizontalAlign.Center)
  }

  // 导出按钮
  @Builder ExportButtons() {
    Row() {
      Button('导出 Excel')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          // 导出 Excel
        })
      
      Button('导出 PDF')
        .width('48%')
        .height(45)
        .backgroundColor('#2196F3')
        .margin({ left: '4%' })
        .onClick(() => {
          // 导出 PDF
        })
    }
    .width('100%')
    .height(60)
    .padding(15)
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }
}
