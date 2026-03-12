/**
 * 服务单详情页面
 * 查看服务进度和详情
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface ServiceOrder {
  id: string;
  orderNo: string;
  serviceType: string;
  serviceLevel: string;
  status: string;
  serviceRequest: string;
  faultDescription?: string;
  customerName: string;
  contactPhone: string;
  assignedEngineerName?: string;
  assignedEngineerPhone?: string;
  appointmentTime?: string;
  acceptedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  solution?: string;
  totalCost?: number;
  satisfactionScore?: number;
  createdAt: string;
}

@Entry
@Component
struct ServiceDetail {
  @State serviceOrder: ServiceOrder | null = null;
  @State isLoading: boolean = true;
  @State showEvaluate: boolean = false;
  
  private apiService: ApiService = new ApiService();
  private serviceOrderId: string = '';

  aboutToAppear(): void {
    // 从路由参数获取服务单 ID
    const params = router.getParams() as Record<string, string>;
    this.serviceOrderId = params['id'] || '';
    this.loadServiceDetail();
  }

  async loadServiceDetail(): Promise<void> {
    try {
      const data = await this.apiService.get(`/mobile/service-orders/${this.serviceOrderId}`);
      this.serviceOrder = data;
      this.showEvaluate = data.status === 'completed' && !data.satisfactionScore;
    } catch (error) {
      console.error('加载服务单详情失败', error);
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
      } else if (this.serviceOrder) {
        Scroll() {
          Column() {
            // 服务单状态
            this.StatusCard()
            
            // 服务信息
            this.ServiceInfo()
            
            // 进度时间轴
            this.ProgressTimeline()
            
            // 工程师信息
            if (this.serviceOrder.assignedEngineerName) {
              this.EngineerCard()
            }
            
            // 服务结果
            if (this.serviceOrder.solution) {
              this.SolutionCard()
            }
            
            // 评价入口
            if (this.showEvaluate) {
              this.EvaluateCard()
            }
          }
          .width('100%')
          .padding(15)
        }
        .layoutWeight(1)
      }
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
      
      Text('服务详情')
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
        .margin({ left: 15 })
      
      Blank()
      
      Text(this.serviceOrder?.orderNo || '')
        .fontSize(14)
        .fontColor('#757575')
    }
    .width('100%')
    .height(60)
    .padding({ left: 15, right: 15 })
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 状态卡片
  @Builder StatusCard() {
    Column() {
      Row() {
        Text(this.getStatusText())
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFF')
        
        Blank()
        
        Text(this.getServiceTypeIcon())
          .fontSize(32)
      }
      .width('100%')
      
      Text(this.serviceOrder?.serviceRequest || '')
        .fontSize(14)
        .fontColor('#FFFFFF')
        .opacity(0.9)
        .margin({ top: 10 })
    }
    .width('100%')
    .padding(20)
    .backgroundColor(this.getStatusColor())
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 服务信息
  @Builder ServiceInfo() {
    Column() {
      Text('服务信息')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      this.InfoRow('服务类型', this.serviceOrder?.serviceType || '')
      this.InfoRow('服务级别', this.serviceOrder?.serviceLevel || '')
      this.InfoRow('客户姓名', this.serviceOrder?.customerName || '')
      this.InfoRow('联系电话', this.serviceOrder?.contactPhone || '')
      
      if (this.serviceOrder?.faultDescription) {
        this.InfoRow('故障描述', this.serviceOrder.faultDescription)
      }
      
      if (this.serviceOrder?.appointmentTime) {
        this.InfoRow('预约时间', this.formatDate(this.serviceOrder.appointmentTime))
      }
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
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
    .padding({ top: 10, bottom: 10 })
  }

  // 进度时间轴
  @Builder ProgressTimeline() {
    Column() {
      Text('服务进度')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 20 })
      
      // 时间轴节点
      this.TimelineItem('已提交', this.serviceOrder?.createdAt, true)
      this.TimelineItem('已派单', this.serviceOrder?.acceptedAt, !!this.serviceOrder?.assignedEngineerName)
      this.TimelineItem('已到达', this.serviceOrder?.arrivedAt, !!this.serviceOrder?.arrivedAt)
      this.TimelineItem('已完成', this.serviceOrder?.completedAt, !!this.serviceOrder?.completedAt)
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 时间轴项
  @Builder TimelineItem(label: string, time?: string, completed: boolean = false) {
    Row() {
      Column() {
        Circle()
          .width(12)
          .height(12)
          .fill(completed ? '#4CAF50' : '#E0E0E0')
        
        if (completed) {
          Divider()
            .width(2)
            .height(30)
            .color('#4CAF50')
        } else {
          Divider()
            .width(2)
            .height(30)
            .color('#E0E0E0')
        }
      }
      .alignItems(HorizontalAlign.Center)
      
      Column() {
        Text(label)
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor(completed ? '#212121' : '#9E9E9E')
        
        if (time) {
          Text(this.formatDate(time))
            .fontSize(12)
            .fontColor('#757575')
            .margin({ top: 3 })
        }
      }
      .alignItems(HorizontalAlign.Start)
      .margin({ left: 15 })
      .layoutWeight(1)
    }
    .width('100%')
  }

  // 工程师卡片
  @Builder EngineerCard() {
    Column() {
      Text('服务工程师')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      Row() {
        Column() {
          Text('👨‍🔧')
            .fontSize(32)
          
          Text(this.serviceOrder?.assignedEngineerName || '')
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .fontColor('#212121')
            .margin({ top: 8 })
        }
        .alignItems(HorizontalAlign.Center)
        
        Blank()
        
        Column() {
          Button('联系工程师')
            .width(120)
            .height(40)
            .backgroundColor('#1976D2')
            .fontSize(14)
            .onClick(() => {
              // 拨打电话
            })
        }
      }
      .width('100%')
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 服务结果
  @Builder SolutionCard() {
    Column() {
      Text('服务结果')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      Text(this.serviceOrder?.solution || '')
        .fontSize(14)
        .fontColor('#212121')
        .lineHeight(24)
        .width('100%')
      
      if (this.serviceOrder?.totalCost && this.serviceOrder.totalCost > 0) {
        Row() {
          Text('服务费用')
            .fontSize(14)
            .fontColor('#757575')
          
          Blank()
          
          Text(`¥${this.serviceOrder.totalCost}`)
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF9800')
        }
        .width('100%')
        .margin({ top: 15 })
      }
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 评价入口
  @Builder EvaluateCard() {
    Column() {
      Text('服务完成，请您评价')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#212121')
        .width('100%')
        .margin({ bottom: 15 })
      
      Button('立即评价')
        .width('100%')
        .height(45)
        .backgroundColor('#4CAF50')
        .fontSize(15)
        .onClick(() => {
          router.pushUrl({ url: `pages/ServiceEvaluate?id=${this.serviceOrderId}` });
        })
    }
    .width('100%')
    .padding(20)
    .backgroundColor('#FFFFFF')
    .borderRadius(12)
    .margin({ bottom: 15 })
  }

  // 辅助方法
  getStatusText(): string {
    if (!this.serviceOrder) return '';
    const statusMap: Record<string, string> = {
      'pending': '待处理',
      'assigned': '已派单',
      'accepted': '已接单',
      'processing': '处理中',
      'waiting_parts': '待配件',
      'completed': '已完成',
      'confirmed': '已确认',
      'closed': '已关闭'
    };
    return statusMap[this.serviceOrder.status] || this.serviceOrder.status;
  }

  getStatusColor(): string {
    if (!this.serviceOrder) return '#1976D2';
    const colorMap: Record<string, string> = {
      'pending': '#FF9800',
      'assigned': '#2196F3',
      'processing': '#4CAF50',
      'completed': '#4CAF50',
      'closed': '#9E9E9E'
    };
    return colorMap[this.serviceOrder.status] || '#1976D2';
  }

  getServiceTypeIcon(): string {
    if (!this.serviceOrder) return '📝';
    const iconMap: Record<string, string> = {
      'repair': '🔧',
      'maintenance': '🛠️',
      'installation': '📦',
      'training': '📚',
      'consultation': '💡',
      'complaint': '⚠️'
    };
    return iconMap[this.serviceOrder.serviceType] || '📝';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
}
