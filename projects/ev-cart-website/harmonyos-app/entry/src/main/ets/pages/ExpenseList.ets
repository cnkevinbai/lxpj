/**
 * 付款列表页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface Expense {
  id: string;
  expenseNo: string;
  supplierName: string;
  supplierId: string;
  orderNo?: string;
  amount: number;
  paymentMethod: string;
  status: string;
  paymentDate: string;
  createdAt: string;
  purchaserName: string;
}

@Entry
@Component
struct ExpenseList {
  @State expenses: Expense[] = [];
  @State isLoading: boolean = true;
  @State selectedStatus: string = 'all';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadExpenses();
  }

  async loadExpenses(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/expenses', {
        page: 1,
        limit: 20,
        status: this.selectedStatus === 'all' ? '' : this.selectedStatus,
      });
      this.expenses = data.items;
    } catch (error) {
      console.error('加载付款列表失败', error);
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
      
      // 付款列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.expenses, (expense) => {
            this.ExpenseItem(expense)
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
      Text('付款管理')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 统计
      Text(`共${this.expenses.length}笔`)
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
        this.StatusItem('待审批', 'pending')
        this.StatusItem('已审批', 'approved')
        this.StatusItem('已付款', 'paid')
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
        this.loadExpenses();
      })
  }

  // 付款项
  @Builder ExpenseItem(expense: Expense) {
    Column() {
      Row() {
        Column() {
          Text('💸')
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#FFEBEE')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(expense.expenseNo)
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(this.getStatusBadge(expense.status))
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.getStatusColor(expense.status))
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(expense.supplierName)
            .fontSize(13)
            .fontColor('#757575')
            .margin({ top: 5 })
          
          if (expense.orderNo) {
            Text(`订单：${expense.orderNo}`)
              .fontSize(12)
              .fontColor('#9E9E9E')
              .margin({ top: 3 })
          }
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text('¥' + (expense.amount / 10000).toFixed(1) + '万')
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor('#F44336')
          
          Text(this.getPaymentMethod(expense.paymentMethod))
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
        Text(`付款：${this.formatDate(expense.paymentDate)}`)
          .fontSize(12)
          .fontColor('#757575')
        
        Blank()
        
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/ExpenseDetail?id=${expense.id}` });
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
      Button('登记付款')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateExpense' });
        })
      
      Button('付款统计')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/ExpenseStatistics' });
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
      'pending': '待审批',
      'approved': '已审批',
      'paid': '已付款',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'pending': '#FF9800',
      'approved': '#2196F3',
      'paid': '#F44336',
    };
    return colors[status] || '#9E9E9E';
  }

  getPaymentMethod(method: string): string {
    const methods: Record<string, string> = {
      'bank_transfer': '银行转账',
      'cash': '现金',
      'check': '支票',
    };
    return methods[method] || method;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}
