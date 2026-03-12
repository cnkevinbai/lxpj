/**
 * 财务报表列表页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface FinancialReport {
  id: string;
  reportNo: string;
  reportType: string;
  period: string;
  status: string;
  createdAt: string;
  creatorName: string;
}

@Entry
@Component
struct FinancialReportList {
  @State reports: FinancialReport[] = [];
  @State isLoading: boolean = true;
  @State selectedType: string = 'all';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadReports();
  }

  async loadReports(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/financial-reports', {
        page: 1,
        limit: 20,
        type: this.selectedType === 'all' ? '' : this.selectedType,
      });
      this.reports = data.items;
    } catch (error) {
      console.error('加载财务报表失败', error);
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
      Text('财务报表')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
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

  // 类型筛选
  @Builder TypeFilter() {
    Scroll() {
      Row() {
        this.TypeItem('全部', 'all')
        this.TypeItem('资产负债表', 'balance')
        this.TypeItem('利润表', 'income')
        this.TypeItem('现金流量表', 'cashflow')
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
        this.loadReports();
      })
  }

  // 报表项
  @Builder ReportItem(report: FinancialReport) {
    Column() {
      Row() {
        Column() {
          Text('📊')
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#FFF3E0')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(report.reportNo)
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(this.getTypeBadge(report.reportType))
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.getTypeColor(report.reportType))
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(report.period)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
          
          Text(`创建：${report.creatorName}`)
            .fontSize(12)
            .fontColor('#9E9E9E')
            .margin({ top: 3 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(this.getStatusBadge(report.status))
            .fontSize(12)
            .fontColor('#FFFFFF')
            .padding({ left: 6, right: 6, top: 2, bottom: 2 })
            .backgroundColor(this.getStatusColor(report.status))
            .borderRadius(4)
        }
        .alignItems(HorizontalAlign.Center)
      }
      .width('100%')
      .padding(15)
      
      Divider().color('#E0E0E0').margin({ left: 80 })
      
      Row() {
        Text(`创建：${this.formatDate(report.createdAt)}`)
          .fontSize(12)
          .fontColor('#757575')
        
        Blank()
        
        Text('查看')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/FinancialReportDetail?id=${report.id}` });
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
      Button('生成报表')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateFinancialReport' });
        })
      
      Button('报表分析')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/FinancialAnalysis' });
        })
    }
    .width('100%')
    .height(70)
    .padding(15)
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 辅助方法
  getTypeBadge(type: string): string {
    const badges: Record<string, string> = {
      'balance': '资产负债表',
      'income': '利润表',
      'cashflow': '现金流量表',
    };
    return badges[type] || type;
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'balance': '#2196F3',
      'income': '#4CAF50',
      'cashflow': '#FF9800',
    };
    return colors[type] || '#9E9E9E';
  }

  getStatusBadge(status: string): string {
    const badges: Record<string, string> = {
      'draft': '草稿',
      'approved': '已审核',
      'published': '已发布',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'draft': '#9E9E9E',
      'approved': '#2196F3',
      'published': '#4CAF50',
    };
    return colors[status] || '#9E9E9E';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}
