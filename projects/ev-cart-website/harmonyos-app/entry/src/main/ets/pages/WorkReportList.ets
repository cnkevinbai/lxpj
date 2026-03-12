/**
 * 报工列表页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface WorkReport {
  id: string;
  reportNo: string;
  productionOrderNo: string;
  productName: string;
  workshopName: string;
  lineName: string;
  quantity: number;
  qualifiedQuantity: number;
  defectiveQuantity: number;
  qualifiedRate: number;
  reportDate: string;
  operatorName: string;
}

@Entry
@Component
struct WorkReportList {
  @State reports: WorkReport[] = [];
  @State isLoading: boolean = true;
  @State selectedDate: string = '';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadReports();
  }

  async loadReports(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/work-reports', {
        page: 1,
        limit: 20,
        date: this.selectedDate,
      });
      this.reports = data.items;
    } catch (error) {
      console.error('加载报工列表失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 日期筛选
      this.DateFilter()
      
      // 报工列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.reports, (report) => {
            this.ReportItem(report)
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
      Text('报工管理')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 统计
      Text(`共${this.reports.length}个`)
        .fontSize(14)
        .fontColor('#757575')
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 日期筛选
  @Builder DateFilter() {
    Row() {
      Text('日期：')
        .fontSize(14)
        .fontColor('#757575')
      
      Text(this.selectedDate || '今天')
        .fontSize(14)
        .fontColor('#1976D2')
        .onClick(() => {
          // TODO: 打开日期选择器
        })
    }
    .width('100%')
    .padding({ left: 15, right: 15, top: 10, bottom: 10 })
    .backgroundColor('#FFFFFF')
  }

  // 报工项
  @Builder ReportItem(report: WorkReport) {
    Column() {
      Row() {
        Column() {
          Text('✅')
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#E8F5E9')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(report.reportNo)
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(`${report.qualifiedRate.toFixed(1)}%`)
              .fontSize(12)
              .fontColor(report.qualifiedRate >= 95 ? '#4CAF50' : '#FF9800')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(report.qualifiedRate >= 95 ? '#4CAF50' : '#FF9800')
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(`${report.productName}`)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
          
          Text(`${report.workshopName} ${report.lineName}`)
            .fontSize(12)
            .fontColor('#9E9E9E')
            .margin({ top: 3 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(`${report.qualifiedQuantity}/${report.quantity}`)
            .fontSize(14)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text('合格/总数')
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
        Text(`报工：${this.formatDate(report.reportDate)}`)
          .fontSize(12)
          .fontColor('#757575')
        
        Text(` · ${report.operatorName}`)
          .fontSize(12)
          .fontColor('#757575')
        
        Blank()
        
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/WorkReportDetail?id=${report.id}` });
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
      Button('登记报工')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateWorkReport' });
        })
      
      Button('报工统计')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/WorkReportStatistics' });
        })
    }
    .width('100%')
    .height(70)
    .padding(15)
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 辅助方法
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}
