/**
 * 消息中心页面
 * 审批通知/工单通知/系统通知
 */

import { router } from '@kit.ArkUI';
import { ApiService } from '../services/ApiService';

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

@Entry
@Component
struct Notifications {
  @State notifications: Notification[] = [];
  @State isLoading: boolean = true;
  @State activeTab: number = 0; // 0: 全部，1: 未读，2: 已读
  
  private apiService: ApiService = new ApiService();

  aboutToAppear(): void {
    this.loadNotifications();
  }

  async loadNotifications(): Promise<void> {
    try {
      const data = await this.apiService.get('/mobile/notifications', {
        page: 1,
        limit: 50,
        status: this.getStatusFilter()
      });
      this.notifications = data.items;
    } catch (error) {
      console.error('加载通知列表失败', error);
    } finally {
      this.isLoading = false;
    }
  }

  getStatusFilter(): string {
    const filters = ['', 'unread', 'read'];
    return filters[this.activeTab] || '';
  }

  build() {
    Column() {
      // 顶部导航
      this.Header()
      
      // 标签页
      this.Tabs()
      
      // 通知列表
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ top: 50 })
      } else {
        List() {
          ForEach(this.notifications, (notification: Notification) => {
            this.NotificationItem(notification)
          })
        }
        .width('100%')
        .layoutWeight(1)
      }
      
      // 底部按钮
      if (this.activeTab === 1 && this.notifications.length > 0) {
        this.BottomBar()
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  // 顶部导航
  @Builder Header() {
    Row() {
      Text('消息中心')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#212121')
      
      Blank()
      
      // 设置按钮
      Image($r('sys.media.ohos_ic_public_settings'))
        .width(24)
        .height(24)
        .onClick(() => {
          // 设置
        })
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
      this.TabItem('未读', 1)
      this.TabItem('已读', 2)
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
    .width('33%')
    .alignItems(HorizontalAlign.Center)
    .onClick(() => {
      this.activeTab = index;
      this.loadNotifications();
    })
  }

  // 通知项
  @Builder NotificationItem(notification: Notification) {
    Column() {
      Row() {
        Column() {
          Text(this.getTypeIcon(notification.type))
            .fontSize(24)
        }
        .width(50)
        .height(50)
        .backgroundColor(this.getTypeColor(notification.type))
        .borderRadius(25)
        .justifyContent(FlexAlign.Center)
        
        Column() {
          Text(notification.title)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .fontColor(notification.isRead ? '#757575' : '#212121')
          
          Text(notification.content)
            .fontSize(13)
            .fontColor('#757575')
            .maxLines(2)
            .ellipsis(true)
            .margin({ top: 5 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 15 })
        .layoutWeight(1)
        
        if (!notification.isRead) {
          Circle()
            .width(8)
            .height(8)
            .fill('#F44336')
        }
      }
      .width('100%')
      .padding(15)
      
      Divider().color('#E0E0E0').margin({ left: 80 })
      
      Row() {
        Text(this.formatDate(notification.createdAt))
          .fontSize(12)
          .fontColor('#757575')
        
        Blank()
        
        Text('详情')
          .fontSize(14)
          .fontColor('#1976D2')
      }
      .width('100%')
      .padding({ left: 15, right: 15, top: 10, bottom: 15 })
    }
    .backgroundColor('#FFFFFF')
    .margin({ bottom: 10 })
    .onClick(() => {
      this.markAsRead(notification.id);
      router.pushUrl({ url: `pages/NotificationDetail?id=${notification.id}` });
    })
  }

  // 底部按钮
  @Builder BottomBar() {
    Row() {
      Button('全部标为已读')
        .width('100%')
        .height(45)
        .backgroundColor('#1976D2')
        .onClick(() => {
          this.markAllAsRead();
        })
    }
    .width('100%')
    .height(60)
    .padding(15)
    .backgroundColor('#FFFFFF')
    .alignItems(VerticalAlign.Center)
  }

  // 获取类型图标
  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'approval': '✅',
      'workorder': '🔧',
      'order': '📋',
      'system': '📢',
      'reminder': '⏰'
    };
    return icons[type] || '📝';
  }

  // 获取类型颜色
  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'approval': '#E3F2FD',
      'workorder': '#FFF3E0',
      'order': '#E8F5E9',
      'system': '#F3E5F5',
      'reminder': '#FFEBEE'
    };
    return colors[type] || '#F5F5F5';
  }

  // 标记为已读
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await this.apiService.post(`/mobile/notifications/${notificationId}/read`);
      this.loadNotifications();
    } catch (error) {
      console.error('标记已读失败', error);
    }
  }

  // 全部标为已读
  async markAllAsRead(): Promise<void> {
    try {
      await this.apiService.post('/mobile/notifications/read-all');
      this.loadNotifications();
    } catch (error) {
      console.error('全部标为已读失败', error);
    }
  }

  // 格式化日期
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`;
    } else {
      return `${Math.floor(diff / 86400000)}天前`;
    }
  }
}
