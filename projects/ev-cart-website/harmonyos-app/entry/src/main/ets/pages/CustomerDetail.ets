/**
 * 客户详情页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface Customer {
  id: string;
  customerCode: string;
  customerName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  level: string;
  status: string;
  address: string;
  industry: string;
  totalOrders: number;
  totalAmount: number;
  receivableAmount: number;
  lastOrderDate: string;
  createdAt: string;
  remark: string;
}

@Entry
@Component
struct CustomerDetail {
  @State customer: Customer | null = null;
  @State isLoading: boolean = true;
  @State activeTab: number = 0; // 0: 基本信息，1: 联系记录，2: 订单历史
  
  private apiService: ApiService = new ApiService();
  private customerId: string = '';

  aboutToAppear(): void {
    const params = router.getParams() as Record<string, string>;
    this.customerId = params['id'] || '';
    this.loadCustomer();
  }

  async loadCustomer(): Promise<void> {
    try {
      const data = await this.apiService.get(`/mobile/customers/${this.customerId}`);
      this.customer = data;
    } catch (error) {
      console.error('加载客户详情失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else if (this.customer) {
        // 客户信息卡片
        this.CustomerInfoCard()
        
        // 标签页
        this.Tabs()
        
        // 标签内容
        this.TabContent()
      }
      
      // 底部操作栏
      this.BottomBar()
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  // 顶部导航
  @Builder Header() {
    Row() {
      Image($r('sys.media.ohos_ic_public_arrow_left'))
        .width(24)
        .height(24)
        .onClick(() => {
          router.back();
        })
      
      Text('客户详情')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .margin({ left: 15 })
      
      Blank()
      
      // 编辑按钮
      Image($r('sys.media.ohos_ic_public_edit'))
        .width(24)
        .height(24)
        .onClick(() => {
          router.pushUrl({ url: `pages/EditCustomer?id=${this.customerId}` });
        })
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 客户信息卡片
  @Builder CustomerInfoCard() {
    Column() {
      Row() {
        Column() {
          Text(this.customer?.customerName.substring(0, 1) || '')
            .fontSize(32)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FFFFFF')
        }
        .width(70)
        .height(70)
        .backgroundColor('#1976D2')
        .borderRadius(35)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Row() {
            Text(this.customer?.customerName || '')
              .fontSize(20)
              .fontWeight(FontWeight.Bold)
              .fontColor('#212121')
            
            Text(this.getLevelBadge(this.customer?.level || ''))
              .fontSize(12)
              .fontColor('#FFFFFF')
              .padding({ left: 6, right: 6, top: 2, bottom: 2 })
              .backgroundColor(this.getLevelColor(this.customer?.level || ''))
              .borderRadius(4)
              .margin({ left: 10 })
          }
          
          Text(`${this.customer?.contactPerson} ${this.customer?.contactPhone}`)
            .fontSize(14)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
      }
      .width('100%')
      .padding(20)
      
      // 关键指标
      Row() {
        this.StatItem('订单数', `${this.customer?.totalOrders || 0}`)
        this.StatItem('总金额', `¥${((this.customer?.totalAmount || 0) / 10000).toFixed(1)}万`)
        this.StatItem('应收', `¥${((this.customer?.receivableAmount || 0) / 10000).toFixed(1)}万`)
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 10, bottom: 20 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 统计项
  @Builder StatItem(label: string, value: string) {
    Column() {
      Text(value)
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#1976D2')
      
      Text(label)
        .fontSize(12)
        .fontColor('#757575')
        .margin({ top: 4 })
    }
    .width('33%')
    .alignItems(HorizontalAlign.Center)
  }

  // 标签页
  @Builder Tabs() {
    Row() {
      this.TabItem('基本信息', 0)
      this.TabItem('联系记录', 1)
      this.TabItem('订单历史', 2)
    }
    .width('100%')
    .height(50)
    .backgroundColor('#FFFFFF')
    .padding({ left: 15, right: 15 })
  }

  // 标签项
  @Builder TabItem(label: string, index: number) {
    Column() {
      Text(label)
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
    .width('33%')
    .alignItems(HorizontalAlign.Center)
    .onClick(() => {
      this.activeTab = index;
    })
  }

  // 标签内容
  @Builder TabContent() {
    if (this.activeTab === 0) {
      this.BasicInfoTab()
    } else if (this.activeTab === 1) {
      this.ContactRecordsTab()
    } else {
      this.OrderHistoryTab()
    }
  }

  // 基本信息
  @Builder BasicInfoTab() {
    Column() {
      this.InfoRow('客户编码', this.customer?.customerCode || '')
      this.InfoRow('所属行业', this.customer?.industry || '')
      this.InfoRow('客户地址', this.customer?.address || '')
      this.InfoRow('电子邮箱', this.customer?.contactEmail || '')
      this.InfoRow('客户状态', this.getStatusText(this.customer?.status || ''))
      this.InfoRow('最后下单', this.formatDate(this.customer?.lastOrderDate || ''))
      this.InfoRow('创建时间', this.formatDate(this.customer?.createdAt || ''))
      
      if (this.customer?.remark) {
        this.InfoRow('备注', this.customer.remark)
      }
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 信息行
  @Builder InfoRow(label: string, value: string) {
    Row() {
      Text(label)
        .fontSize(14)
        .fontColor('#757575')
        .width(100)
      
      Text(value)
        .fontSize(14)
        .fontColor('#212121')
        .layoutWeight(1)
    }
    .width('100%')
    .padding({ left: 20, right: 20, top: 15, bottom: 15 })
  }

  // 联系记录
  @Builder ContactRecordsTab() {
    Column() {
      Text('暂无联系记录')
        .fontSize(14)
        .fontColor('#757575')
        .margin({ top: 50 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 订单历史
  @Builder OrderHistoryTab() {
    Column() {
      Text('暂无订单记录')
        .fontSize(14)
        .fontColor('#757575')
        .margin({ top: 50 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 底部操作栏
  @Builder BottomBar() {
    Row() {
      Button('拨打电话')
        .width('48%')
        .height(45)
        .backgroundColor('#4CAF50')
        .onClick(() => {
          // TODO: 拨打电话
        })
      
      Button('创建订单')
        .width('48%')
        .height(45)
        .backgroundColor('#1976D2')
        .margin({ left: '4%' })
        .onClick(() => {
          router.pushUrl({ url: `pages/CreateOrder?customerId=${this.customerId}` });
        })
    }
    .width('100%')
    .height(80)
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

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
