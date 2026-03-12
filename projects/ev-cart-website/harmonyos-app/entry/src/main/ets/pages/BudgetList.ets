/**
 * 预算管理列表页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface Budget {
  id: string;
  budgetNo: string;
  budgetType: string;
  departmentName: string;
  period: string;
  budgetAmount: number;
  actualAmount: number;
  achievementRate: number;
  status: string;
}

@Entry
@Component
struct BudgetList {
  @State budgets: Budget[] = [];
  @State isLoading: boolean = true;
  @State selectedType: string = 'all';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadBudgets();
  }

  async loadBudgets(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/budgets', {
        page: 1,
        limit: 20,
        type: this.selectedType === 'all' ? '' : this.selectedType,
      });
      this.budgets = data.items;
    } catch (error) {
      console.error('加载预算列表失败', error);
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
          ForEach(this.budgets, (budget) => {
            this.BudgetItem(budget)
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
      Text('预算管理')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      Text(`共${this.budgets.length}个`)
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
        this.TypeItem('销售预算', 'sales')
        this.TypeItem('生产预算', 'production')
        this.TypeItem('采购预算', 'purchase')
        this.TypeItem('费用预算', 'expense')
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
        this.loadBudgets();
      })
  }

  // 预算项
  @Builder BudgetItem(budget: Budget) {
    Column() {
      Row() {
        Column() {
          Text('💰')
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#E3F2FD')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(budget.budgetNo)
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(this.getStatusBadge(budget.status))
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.getStatusColor(budget.status))
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(`${budget.departmentName} · ${budget.budgetType}`)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
          
          Text(`${budget.period} · 预算¥${(budget.budgetAmount / 10000).toFixed(1)}万`)
            .fontSize(12)
            .fontColor('#9E9E9E')
            .margin({ top: 3 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(`¥${(budget.actualAmount / 10000).toFixed(1)}万`)
            .fontSize(14)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text(`${budget.achievementRate.toFixed(1)}%`)
            .fontSize(12)
            .fontColor(budget.achievementRate <= 100 ? '#4CAF50' : '#F44336')
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
            router.pushUrl({ url: `pages/BudgetDetail?id=${budget.id}` });
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
      Button('编制预算')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateBudget' });
        })
      
      Button('预算分析')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/BudgetAnalysis' });
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
      'draft': '草稿',
      'approved': '已批准',
      'in_progress': '执行中',
      'completed': '已完成',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'draft': '#9E9E9E',
      'approved': '#2196F3',
      'in_progress': '#4CAF50',
      'completed': '#FF9800',
    };
    return colors[status] || '#9E9E9E';
  }
}
