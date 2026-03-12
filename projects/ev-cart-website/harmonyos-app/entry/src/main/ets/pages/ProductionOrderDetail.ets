/**
 * 生产工单详情页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface ProductionOrder {
  id: string;
  orderNo: string;
  productName: string;
  productModel: string;
  quantity: number;
  completedQuantity: number;
  defectiveQuantity: number;
  status: string;
  priority: string;
  planStartDate: string;
  planEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  workshopName?: string;
  lineName?: string;
  progress: number;
  salesOrderNo?: string;
  remark?: string;
  createdAt: string;
}

@Entry
@Component
struct ProductionOrderDetail {
  @State order: ProductionOrder | null = null;
  @State isLoading: boolean = true;
  @State activeTab: number = 0; // 0: 工单信息，1: 工序记录，2: 质量检验
  
  private apiService: ApiService = new ApiService();
  private orderId: string = '';

  aboutToAppear(): void {
    const params = router.getParams() as Record<string, string>;
    this.orderId = params['id'] || '';
    this.loadOrder();
  }

  async loadOrder(): Promise<void> {
    try {
      const data = await this.apiService.get(`/mobile/production-orders/${this.orderId}`);
      this.order = data;
    } catch (error) {
      console.error('加载工单详情失败', error);
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
      } else if (this.order) {
        // 工单状态卡片
        this.OrderStatusCard()
        
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
      
      Text('生产工单详情')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .margin({ left: 15 })
      
      Blank()
      
      // 更多操作
      Image($r('sys.media.ohos_ic_public_more'))
        .width(24)
        .height(24)
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 工单状态卡片
  @Builder OrderStatusCard() {
    Column() {
      Row() {
        Text(this.order?.orderNo || '')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#212121')
        
        Text(this.getStatusBadge(this.order?.status || ''))
          .fontSize(14)
          .fontColor('#FFFFFF')
          .padding({ left: 8, right: 8, top: 4, bottom: 4 })
          .backgroundColor(this.getStatusColor(this.order?.status || ''))
          .borderRadius(4)
          .margin({ left: 10 })
      }
      
      // 进度条
      Row() {
        Row() {
          Text('生产进度')
            .fontSize(12)
            .fontColor('#757575')
          
          Text(`${this.order?.progress || 0}%`)
            .fontSize(14)
            .fontWeight(FontWeight.Bold)
            .fontColor('#1976D2')
            .margin({ left: 5 })
        }
        
        Text(`${this.order?.completedQuantity || 0}/${this.order?.quantity || 0} 件`)
          .fontSize(14)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FF9800')
      }
      .width('100%')
      .margin({ top: 15 })
      
      // 进度条背景
      Row() {
        Row() {
          BackgroundColor('#1976D2')
            .width(`${this.order?.progress || 0}%`)
            .height(8)
            .borderRadius(4)
        }
        
        BackgroundColor('#E0E0E0')
          .width(`${100 - (this.order?.progress || 0)}%`)
          .height(8)
          .borderRadius(4)
      }
      .width('100%')
      .height(8)
      .margin({ top: 8 })
    }
    .backgroundColor('#FFFFFF')
    .padding(20)
    .margin({ bottom: 10 })
  }

  // 标签页
  @Builder Tabs() {
    Row() {
      this.TabItem('工单信息', 0)
      this.TabItem('工序记录', 1)
      this.TabItem('质量检验', 2)
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
      this.OrderInfoTab()
    } else if (this.activeTab === 1) {
      this.ProcessRecordsTab()
    } else {
      this.QualityInspectionsTab()
    }
  }

  // 工单信息
  @Builder OrderInfoTab() {
    Column() {
      this.InfoRow('产品', `${this.order?.productName} ${this.order?.productModel}`)
      this.InfoRow('生产数量', `${this.order?.quantity || 0} 件`)
      this.InfoRow('完成数量', `${this.order?.completedQuantity || 0} 件`)
      this.InfoRow('不良数量', `${this.order?.defectiveQuantity || 0} 件`)
      this.InfoRow('优先级', this.getPriorityText(this.order?.priority || ''))
      this.InfoRow('车间', `${this.order?.workshopName || ''} ${this.order?.lineName || ''}`)
      this.InfoRow('计划开始', this.formatDate(this.order?.planStartDate || ''))
      this.InfoRow('计划结束', this.formatDate(this.order?.planEndDate || ''))
      
      if (this.order?.actualStartDate) {
        this.InfoRow('实际开始', this.formatDate(this.order.actualStartDate))
      }
      
      if (this.order?.salesOrderNo) {
        this.InfoRow('销售订单', this.order.salesOrderNo)
      }
      
      if (this.order?.remark) {
        this.InfoRow('备注', this.order.remark)
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

  // 工序记录
  @Builder ProcessRecordsTab() {
    Column() {
      Text('暂无工序记录')
        .fontSize(14)
        .fontColor('#757575')
        .margin({ top: 50 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 质量检验
  @Builder QualityInspectionsTab() {
    Column() {
      Text('暂无质量检验记录')
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
      if (this.order?.status === 'released') {
        Button('开始生产')
          .width('48%')
          .height(45)
          .backgroundColor('#4CAF50')
          .onClick(() => {
            // TODO: 开始生产
          })
        
        Button('报工')
          .width('48%')
          .height(45)
          .backgroundColor('#1976D2')
          .margin({ left: '4%' })
          .onClick(() => {
            router.pushUrl({ url: `pages/ReportWork?orderId=${this.orderId}` });
          })
      } else if (this.order?.status === 'in_progress') {
        Button('报工')
          .width('48%')
          .height(45)
          .backgroundColor('#1976D2')
          .onClick(() => {
            router.pushUrl({ url: `pages/ReportWork?orderId=${this.orderId}` });
          })
        
        Button('检验')
          .width('48%')
          .height(45)
          .backgroundColor('#FF9800')
          .margin({ left: '4%' })
          .onClick(() => {
            router.pushUrl({ url: `pages/CreateQualityInspection?orderId=${this.orderId}` });
          })
      } else {
        Button('查看详情')
          .width('100%')
          .height(45)
          .backgroundColor('#1976D2')
      }
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
      'pending': '待计划',
      'planned': '已计划',
      'released': '已下达',
      'in_progress': '生产中',
      'completed': '已完成',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'pending': '#9E9E9E',
      'planned': '#2196F3',
      'released': '#4CAF50',
      'in_progress': '#4CAF50',
      'completed': '#4CAF50',
    };
    return colors[status] || '#9E9E9E';
  }

  getPriorityText(priority: string): string {
    const texts: Record<string, string> = {
      'low': '低',
      'normal': '普通',
      'high': '高',
      'urgent': '紧急',
    };
    return texts[priority] || priority;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
