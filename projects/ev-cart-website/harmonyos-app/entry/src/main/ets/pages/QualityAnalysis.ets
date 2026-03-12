/**
 * 质量分析页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

@Entry
@Component
struct QualityAnalysis {
  @State analysisData: {
    totalInspections: number;
    qualifiedRate: number;
    defectRate: number;
    topDefectTypes: Array<{ name: string; count: number }>;
    trendData: Array<{ date: string; rate: number }>;
  } | null = null;
  @State isLoading: boolean = true;
  @State selectedPeriod: string = 'month';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadAnalysis();
  }

  async loadAnalysis(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/quality/analysis', {
        period: this.selectedPeriod,
      });
      this.analysisData = data;
    } catch (error) {
      console.error('加载质量分析失败', error);
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
        // 质量概览
        this.QualityOverview()
        
        // 不良类型分析
        this.DefectTypeAnalysis()
        
        // 趋势分析
        this.TrendAnalysis()
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  // 顶部导航
  @Builder Header() {
    Row() {
      Text('质量分析')
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
    Row() {
      this.PeriodItem('本周', 'week')
      this.PeriodItem('本月', 'month')
      this.PeriodItem('本季', 'quarter')
      this.PeriodItem('本年', 'year')
    }
    .width('100%')
    .padding({ left: 15, right: 15, top: 10, bottom: 10 })
    .backgroundColor('#FFFFFF')
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

  // 质量概览
  @Builder QualityOverview() {
    Column() {
      Row() {
        Text('质量概览')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      Row() {
        // 总检验数
        Column() {
          Text(this.analysisData?.totalInspections?.toString() || '0')
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .fontColor('#1976D2')
          
          Text('总检验数')
            .fontSize(12)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .width('25%')
        
        // 合格率
        Column() {
          Text((this.analysisData?.qualifiedRate || 0).toFixed(1) + '%')
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .fontColor('#4CAF50')
          
          Text('合格率')
            .fontSize(12)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .width('25%')
        
        // 不良率
        Column() {
          Text((this.analysisData?.defectRate || 0).toFixed(1) + '%')
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .fontColor('#F44336')
          
          Text('不良率')
            .fontSize(12)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .width('25%')
        
        // 改进措施
        Column() {
          Text('3')
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text('改进措施')
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

  // 不良类型分析
  @Builder DefectTypeAnalysis() {
    Column() {
      Row() {
        Text('不良类型分析')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      ForEach(this.analysisData?.topDefectTypes || [], (defect) => {
        Row() {
          Text(defect.name)
            .fontSize(14)
            .fontColor('#212121')
            .width(100)
          
          Row() {
            Row() {
              BackgroundColor('#F44336')
                .width(`${(defect.count / (this.analysisData?.totalInspections || 1)) * 100}%`)
                .height(8)
                .borderRadius(4)
            }
            
            BackgroundColor('#E0E0E0')
              .width(`${100 - (defect.count / (this.analysisData?.totalInspections || 1)) * 100}%`)
              .height(8)
              .borderRadius(4)
          }
          .layoutWeight(1)
          .margin({ left: 10 })
          
          Text(defect.count.toString())
            .fontSize(14)
            .fontWeight(FontWeight.Bold)
            .fontColor('#F44336')
            .width(40)
            .textAlign(TextAlign.End)
        }
        .width('100%')
        .padding({ left: 20, right: 20, top: 10, bottom: 10 })
      })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 趋势分析
  @Builder TrendAnalysis() {
    Column() {
      Row() {
        Text('合格率趋势')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      // 趋势图占位
      Column() {
        Text('合格率趋势图')
          .fontSize(14)
          .fontColor('#757575')
          .margin({ top: 30, bottom: 10 })
        
        // 简单趋势展示
        ForEach(this.analysisData?.trendData || [], (item, index) => {
          Row() {
            Text(item.date)
              .fontSize(12)
              .fontColor('#757575')
              .width(60)
            
            Row() {
              Row() {
                BackgroundColor('#4CAF50')
                  .width(`${item.rate}%`)
                  .height(6)
                  .borderRadius(3)
              }
              
              BackgroundColor('#E0E0E0')
                .width(`${100 - item.rate}%`)
                .height(6)
                .borderRadius(3)
            }
            .layoutWeight(1)
            .margin({ left: 10 })
            
            Text(item.rate.toFixed(1) + '%')
              .fontSize(12)
              .fontColor('#4CAF50')
              .width(50)
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
}
