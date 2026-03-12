/**
 * 底部导航栏组件
 */

@Component
export struct BottomNavBar {
  @Link currentPage: string;
  onPageChange: (page: string) => void = () => {};

  // 导航项配置
  private navItems: Array<{
    icon: string;
    label: string;
    page: string;
  }> = [
    { icon: '🏠', label: '工作台', page: 'Dashboard' },
    { icon: '📋', label: '业务', page: 'Business' },
    { icon: '✅', label: '审批', page: 'Approvals' },
    { icon: '🔔', label: '消息', page: 'Notifications' },
    { icon: '👤', label: '我的', page: 'Profile' },
  ];

  build() {
    Row() {
      ForEach(this.navItems, (item) => {
        Column() {
          Text(item.icon)
            .fontSize(24)
          
          Text(item.label)
            .fontSize(12)
            .fontColor(this.currentPage === item.page ? '#1976D2' : '#757575')
            .margin({ top: 4 })
        }
        .width('20%')
        .padding({ top: 8, bottom: 8 })
        .backgroundColor(this.currentPage === item.page ? '#E3F2FD' : '#FFFFFF')
        .onClick(() => {
          this.currentPage = item.page;
          this.onPageChange(item.page);
        })
      })
    }
    .width('100%')
    .height(60)
    .backgroundColor('#FFFFFF')
    .borderRadius({ topLeft: 16, topRight: 16 })
    .shadow({ radius: 8, color: 'rgba(0,0,0,0.1)', offsetY: -2 })
  }
}
