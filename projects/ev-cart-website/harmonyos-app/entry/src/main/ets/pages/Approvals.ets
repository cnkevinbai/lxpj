/**
 * 审批中心页面
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface Approval {
  id: string;
  approvalNo: string;
  title: string;
  type: string;
  applicant: string;
  status: string;
  amount?: number;
  createdAt: string;
}

@Entry
@Component
struct Approvals {
  @State approvals: Approval[] = [];
  @State isLoading: boolean = true;
  @State activeTab: number = 0; // 0: 待我审批，1: 我已审批，2: 我发起的
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadApprovals();
  }

  async loadApprovals(): Promise<void> {
    try {
      const type = ['pending', 'processed', 'created'][this.activeTab];
      const data = await this.apiService.get('/mobile/approvals', {
        page: 1,
        limit: 20,
        type,
      });
      this.approvals = data.items;
    } catch (error) {
      console.error('加载审批列表失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 标签页
      this.Tabs()
      
      // 审批列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.approvals, (approval: Approval) => {
            this.ApprovalItem(approval)
          })
        }
        .width('100%')
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
      Text('审批中心')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 统计
      Text(`共${this.approvals.length}个`)
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
      this.TabItem('待我审批', 0)
      this.TabItem('我已审批', 1)
      this.TabItem('我发起的', 2)
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
      this.loadApprovals();
    })
  }

  // 审批项
  @Builder ApprovalItem(approval: Approval) {
    Column() {
      Row() {
        Column() {
          Text(this.getTypeIcon(approval.type))
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor('#E3F2FD')
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Text(approval.title)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .fontColor('#212121')
            .maxLines(1)
            .ellipsis(true)
          
          Row() {
            Text(`${approval.applicant} 申请`)
              .fontSize(13)
              .fontColor('#757575')
            
            if (approval.amount) {
              Text(` · ¥${(approval.amount / 10000).toFixed(1)}万`)
                .fontSize(13)
                .fontColor('#FF9800')
                .margin({ left: 10 })
            }
          }
          .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        Column() {
          Text(this.getStatusBadge(approval.status))
            .fontSize(12)
            .fontColor('#FFFFFF')
            .padding({ left: 6, right: 6, top: 2, bottom: 2 })
            .backgroundColor(this.getStatusColor(approval.status))
            .borderRadius(4)
          
          Text(this.formatDate(approval.createdAt))
            .fontSize(11)
            .fontColor('#757575')
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Center)
      }
      .width('100%')
      .padding(15)
      
      Divider().color('#E0E0E0').margin({ left: 80 })
      
      Row() {
        Text(approval.approvalNo)
          .fontSize(12)
          .fontColor('#757575')
        
        Blank()
        
        if (this.activeTab === 0) {
          Button('审批')
            .width(80)
            .height(36)
            .backgroundColor('#1976D2')
            .fontSize(14)
            .onClick(() => {
              router.pushUrl({ url: `pages/ApprovalDetail?id=${approval.id}&action=approve` });
            })
        } else {
          Text('详情')
            .fontSize(14)
            .fontColor('#1976D2')
            .onClick(() => {
              router.pushUrl({ url: `pages/ApprovalDetail?id=${approval.id}` });
            })
        }
      }
      .width('100%')
      .padding({ left: 15, right: 15, top: 10, bottom: 15 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
  }

  // 辅助方法
  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'contract': '📄',
      'payment': '💰',
      'purchase': '🛒',
      'leave': '🏖️',
      'expense': '💵',
      'price': '🏷️',
    };
    return icons[type] || '📝';
  }

  getStatusBadge(status: string): string {
    const badges: Record<string, string> = {
      'pending': '待审批',
      'approved': '已通过',
      'rejected': '已驳回',
      'cancelled': '已取消',
    };
    return badges[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'pending': '#FF9800',
      'approved': '#4CAF50',
      'rejected': '#F44336',
      'cancelled': '#9E9E9E',
    };
    return colors[status] || '#9E9E9E';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}
