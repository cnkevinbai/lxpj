/**
 * 客户管理页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface Customer {
  id: string;
  customerCode: string;
  customerName: string;
  contactPerson: string;
  contactPhone: string;
  level: string;
  status: string;
  totalOrders: number;
  totalAmount: number;
}

@Entry
@Component
struct Customers {
  @State customers: Customer[] = [];
  @State isLoading: boolean = true;
  @State searchKeyword: string = '';
  @State selectedLevel: string = 'all';
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadCustomers();
  }

  async loadCustomers(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/customers', {
        page: 1,
        limit: 20,
        keyword: this.searchKeyword,
        level: this.selectedLevel === 'all' ? '' : this.selectedLevel,
      });
      this.customers = data.items;
    } catch (error) {
      console.error('加载客户列表失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 搜索栏
      this.SearchBar()
      
      // 客户列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.customers, (customer: Customer) => {
            this.CustomerItem(customer)
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
      Text('客户管理')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 统计
      Text(`共${this.customers.length}个`)
        .fontSize(14)
        .fontColor('#757575')
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 搜索栏
  @Builder SearchBar() {
    Column() {
      Row() {
        Image($r('sys.media.ohos_ic_public_search'))
          .width(20)
          .height(20)
          .fillColor('#9E9E9E')
        
        TextInput({ placeholder: '搜索客户名称/联系人/电话', text: this.searchKeyword })
          .width('100%')
          .height(40)
          .backgroundColor('#F5F5F5')
          .borderRadius(20)
          .padding({ left: 10, right: 10 })
          .onChange((value: string) => {
            this.searchKeyword = value;
          })
      }
      .width('100%')
      .padding({ left: 15, right: 15 })
      
      // 客户等级筛选
      Scroll() {
        Row() {
          this.LevelFilterItem('全部', 'all')
          this.LevelFilterItem('A 级', 'A')
          this.LevelFilterItem('B 级', 'B')
          this.LevelFilterItem('C 级', 'C')
        }
        .width('100%')
        .padding({ left: 15, right: 15, top: 10 })
      }
      .width('100%')
    }
    .width('100%')
    .height(120)
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 等级筛选项
  @Builder LevelFilterItem(label: string, value: string) {
    Text(label)
      .fontSize(14)
      .fontWeight(this.selectedLevel === value ? FontWeight.Bold : FontWeight.Normal)
      .fontColor(this.selectedLevel === value ? '#FFFFFF' : '#757575')
      .padding({ left: 15, right: 15, top: 8, bottom: 8 })
      .backgroundColor(this.selectedLevel === value ? '#1976D2' : '#F5F5F5')
      .borderRadius(20)
      .margin({ right: 10 })
      .onClick(() => {
        this.selectedLevel = value;
        this.loadCustomers();
      })
  }

  // 客户项
  @Builder CustomerItem(customer: Customer) {
    Column() {
      Row() {
        Column() {
          Text(customer.customerName.substring(0, 1))
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FFFFFF')
        }
        .width(50)
        .height(50)
        .backgroundColor('#1976D2')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(customer.customerName)
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#212121')
            
            Text(this.getLevelBadge(customer.level))
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.getLevelColor(customer.level))
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Row() {
            Text(`${customer.contactPerson} ${customer.contactPhone}`)
              .fontSize(13)
              .fontColor('#757575')
              .margin({ top: 5 })
          }
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(`¥${(customer.totalAmount / 10000).toFixed(1)}万`)
            .fontSize(15)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
          
          Text(`${customer.totalOrders}单`)
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
        Text(this.getStatusText(customer.status))
          .fontSize(12)
          .fontColor(this.getStatusColor(customer.status))
        
        Blank()
        
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/CustomerDetail?id=${customer.id}` });
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
      Button('新建客户')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          router.pushUrl({ url: 'pages/CreateCustomer' });
        })
      
      Button('客户统计')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: 'pages/CustomerStatistics' });
        })
    }
    .width('100%')
    .height(70)
    .padding(15)
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 辅助方法
  getLevelBadge(level: string): string {
    const badges: Record<string, string> = {
      'A': 'A 级',
      'B': 'B 级',
      'C': 'C 级',
      'D': 'D 级',
    };
    return badges[level] || level;
  }

  getLevelColor(level: string): string {
    const colors: Record<string, string> = {
      'A': '#F44336',
      'B': '#FF9800',
      'C': '#4CAF50',
      'D': '#2196F3',
    };
    return colors[level] || '#9E9E9E';
  }

  getStatusText(status: string): string {
    const texts: Record<string, string> = {
      'active': '活跃',
      'inactive': '未激活',
      'blacklisted': '黑名单',
    };
    return texts[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'active': '#4CAF50',
      'inactive': '#9E9E9E',
      'blacklisted': '#F44336',
    };
    return colors[status] || '#9E9E9E';
  }
}
