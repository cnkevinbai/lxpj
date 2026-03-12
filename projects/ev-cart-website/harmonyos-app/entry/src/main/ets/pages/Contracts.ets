/**
 * 合同管理页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface Contract {
  id: string;
  contractNo: string;
  customerName: string;
  type: string;
  status: string;
  totalAmount: number;
  currency: string;
  signDate: string;
  endDate?: string;
}

@Entry
@Component
struct Contracts {
  @State contracts: Contract[] = [];
  @State isLoading: boolean = true;
  @State activeTab: number = 0; // 0: 全部，1: 执行中，2: 已完成，3: 已过期
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadContracts();
  }

  async loadContracts(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/contracts', {
        page: 1,
        limit: 20,
        status: this.getStatusFilter()
      });
      this.contracts = data.items;
    } catch (error) {
      console.error('加载合同列表失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  getStatusFilter(): string {
    const filters = ['', 'active', 'completed', 'expired'];
    return filters[this.activeTab] || '';
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 标签页
      this.Tabs()
      
      // 合同列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.contracts, (contract: Contract) => {
            this.ContractItem(contract)
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
      Text('合同管理')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 统计
      Text(`共${this.contracts.length}份`)
        .fontSize(14)
        .fontColor('#757575')
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 标签页
  @Builder Tabs() {
    Row() {
      this.TabItem('全部', 0)
      this.TabItem('执行中', 1)
      this.TabItem('已完成', 2)
      this.TabItem('已过期', 3)
    }
    .width('100%')
    .height(50)
    .backgroundColor('#FFFFFF')
    .padding({ left: 15, right: 15 })
  }

  // 标签项
  @Builder TabItem(title: string, index: number) {
    Column() {
      Text(title)
        .fontSize(15)
        .fontWeight(this.activeTab === index ? FontWeight.Bold : FontWeight.Normal)
        .fontColor(this.activeTab === index ? '#1976D2' : '#757575')
      
      if (this.activeTab === index) {
        Divider()
          .width(40)
          .height(3)
          .color('#1976D2')
          .margin({ top: 5 })
      }
    }
    .width('25%')
    .alignItems(HorizontalAlign.Center)
    .onClick(() => {
      this.activeTab = index;
      this.loadContracts();
    })
  }

  // 合同项
  @Builder ContractItem(contract: Contract) {
    Column() {
      Row() {
        Column() {
          Text('📄')
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#E3F2FD')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Text(contract.contractNo)
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .fontColor('#212121')
          
          Text(contract.customerName)
            .fontSize(14)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(this.getStatusText(contract.status))
            .fontSize(12)
            .fontColor('#FFFFFF')
            .padding({ left: 8, right: 8, top: 4, bottom: 4 })
            .backgroundColor(this.getStatusColor(contract.status))
            .borderRadius(4)
          
          Text(`${contract.totalAmount / 10000}万`)
            .fontSize(13)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Center)
      }
      .width('100%')
      .padding(15)
      
      Divider().color('#E0E0E0').margin({ left: 80 })
      
      Row() {
        Text(`签订：${this.formatDate(contract.signDate)}`)
          .fontSize(12)
          .fontColor('#757575')
        
        Blank()
        
        if (contract.endDate) {
          Text(`到期：${this.formatDate(contract.endDate)}`)
            .fontSize(12)
            .fontColor('#757575')
            .margin({ left: 15 })
        }
        
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .margin({ left: 15 })
      }
      .width('100%')
      .padding({ left: 15, right: 15, top: 10, bottom: 15 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
    .onClick(() => {
      router.pushUrl({ url: `pages/ContractDetail?id=${contract.id}` });
    })
  }

  // 底部按钮
  @Builder BottomBar() {
    Row() {
      Button('新建合同')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateContract' });
        })
      
      Button('合同统计')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/ContractStatistics' });
        })
    }
    .width('100%')
    .height(70)
    .padding(15)
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 辅助方法
  getStatusText(status: string): string {
    const texts: Record<string, string> = {
      'draft': '草稿',
      'pending': '待审批',
      'approved': '已审批',
      'active': '执行中',
      'completed': '已完成',
      'cancelled': '已取消',
      'expired': '已过期'
    };
    return texts[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'draft': '#9E9E9E',
      'pending': '#FF9800',
      'approved': '#2196F3',
      'active': '#4CAF50',
      'completed': '#4CAF50',
      'cancelled': '#9E9E9E',
      'expired': '#F44336'
    };
    return colors[status] || '#9E9E9E';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
