/**
 * 预算分析页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

@Entry
@Component
struct BudgetAnalysis {
  @State analysisData: {
    totalBudget: number;
    totalActual: number;
    achievementRate: number;
    departmentData: Array<{ name: string; budget: number; actual: number; rate: number }>;
  } | null = null;
  @State isLoading: boolean = true;
  @State selectedPeriod: string = 'month';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadAnalysis();
  }

  async loadAnalysis(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/budget/analysis', {
        period: this.selectedPeriod,
      });
      this.analysisData = data;
    } catch (error) {
      console.error('加载预算分析失败', error);
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
        // 预算概览
        this.BudgetOverview()
        
        // 部门预算执行
        this.DepartmentBudget()
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  // 顶部导航
  @Builder Header() {
    Row() {
      Text('预算分析')
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

  // 预算概览
  @Builder BudgetOverview() {
    Column() {
      Row() {
        Text('预算概览')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      Row() {
        // 总预算
        Column() {
          Text('¥' + ((this.analysisData?.totalBudget || 0) / 10000).toFixed(1) + '万')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#1976D2')
          
          Text('总预算')
            .fontSize(12)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .width('33%')
        
        // 实际执行
        Column() {
          Text('¥' + ((this.analysisData?.totalActual || 0) / 10000).toFixed(1) + '万')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text('实际执行')
            .fontSize(12)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .width('33%')
        
        // 执行率
        Column() {
          Text((this.analysisData?.achievementRate || 0).toFixed(1) + '%')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor(this.analysisData?.achievementRate && this.analysisData.achievementRate <= 100 ? '#4CAF50' : '#F44336')
          
          Text('执行率')
            .fontSize(12)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .width('33%')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 10, bottom: 20 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 部门预算执行
  @Builder DepartmentBudget() {
    Column() {
      Row() {
        Text('部门预算执行')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 15, bottom: 10 })
      
      ForEach(this.analysisData?.departmentData || [], (dept) => {
        Column() {
          Row() {
            Text(dept.name)
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
              .width(80)
            
            Text('¥' + (dept.budget / 10000).toFixed(1) + '万')
              .fontSize(13)
              .fontColor('#757575')
              .width(100)
            
            Row() {
              Row() {
                BackgroundColor(dept.rate <= 100 ? '#4CAF50' : '#F44336')
                  .width(`${Math.min(dept.rate, 100)}%`)
                  .height(6)
                  .borderRadius(3)
              }
              
              BackgroundColor('#E0E0E0')
                .width(`${100 - Math.min(dept.rate, 100)}%`)
                .height(6)
                .borderRadius(3)
            }
            .layoutWeight(1)
            .margin({ left: 10 })
            
            Text(dept.rate.toFixed(1) + '%')
              .fontSize(12)
              .fontColor(dept.rate <= 100 ? '#4CAF50' : '#F44336')
              .width(50)
              .textAlign(TextAlign.End)
          }
          .width('100%')
          
          Row() {
            Text('实际：¥' + (dept.actual / 10000).toFixed(1) + '万')
              .fontSize(11)
              .fontColor('#FF9800')
          }
          .width('100%')
          .margin({ top: 5 })
        }
        .width('100%')
        .padding({ left: 20, right: 20, top: 10, bottom: 10 })
      })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }
}
