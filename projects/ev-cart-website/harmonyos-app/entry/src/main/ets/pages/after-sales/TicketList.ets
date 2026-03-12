/**
 * 工单列表页
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { router } from '@kit.ArkRouter'
import { apiService } from '../../common/services/ApiService'
import { Colors } from '../../common/constants/Colors'
import { Styles } from '../../common/constants/Styles'

// 工单数据类型
interface Ticket {
  id: string
  ticketNo: string
  type: string
  status: string
  priority: string
  customerName: string
  productName: string
  technicianName: string
  createdAt: string
}

@Entry
@Component
struct TicketList {
  @State tickets: Ticket[] = []
  @State loading: boolean = false
  @State filterType: string = ''
  @State filterStatus: string = ''

  aboutToAppear() {
    this.loadTickets()
  }

  async loadTickets() {
    this.loading = true
    try {
      // TODO: 调用实际 API
      // const data = await apiService.get<Ticket[]>('/after-sales/tickets')
      
      // 模拟数据
      this.tickets = [
        {
          id: '1',
          ticketNo: 'GD-20260312-001',
          type: 'repair',
          status: 'processing',
          priority: 'urgent',
          customerName: '张三',
          productName: '产品 A',
          technicianName: '李师傅',
          createdAt: '2026-03-12 10:30:00'
        },
        {
          id: '2',
          ticketNo: 'GD-20260312-002',
          type: 'installation',
          status: 'assigned',
          priority: 'normal',
          customerName: '李四',
          productName: '产品 B',
          technicianName: '王师傅',
          createdAt: '2026-03-12 11:00:00'
        }
      ]
    } catch (error) {
      console.error('Load tickets error:', error)
    } finally {
      this.loading = false
    }
  }

  build() {
    Column() {
      // 导航栏
      this.buildNavBar()

      // 筛选栏
      this.buildFilterBar()

      // 工单列表
      if (this.loading) {
        this.buildLoading()
      } else if (this.tickets.length === 0) {
        this.buildEmpty()
      } else {
        this.buildList()
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Colors.BG_PAGE)
  }

  // 导航栏
  buildNavBar() {
    Row() {
      Image($r('app.media.icon_back'))
        .width(24)
        .height(24)
        .onClick(() => {
          router.back()
        })

      Text('工单管理')
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .margin({ left: 16 })

      Blank()

      Image($r('app.media.icon_add'))
        .width(24)
        .height(24)
        .onClick(() => {
          router.pushUrl({ url: '/pages/after-sales/TicketCreate' })
        })
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
    .backgroundColor(Colors.BG_CARD)
  }

  // 筛选栏
  buildFilterBar() {
    Row() {
      // 类型筛选
      Menu(this.filterType || '类型') {
        MenuItem('全部')
        MenuItem('维修')
        MenuItem('安装')
        MenuItem('保养')
      }
      .onChange((value: string) => {
        this.filterType = value === '全部' ? '' : value
      })

      // 状态筛选
      Menu(this.filterStatus || '状态') {
        MenuItem('全部')
        MenuItem('待受理')
        MenuItem('处理中')
        MenuItem('已完成')
      }
      .onChange((value: string) => {
        this.filterStatus = value === '全部' ? '' : value
      })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
  }

  // 加载状态
  buildLoading() {
    Column() {
      LoadingProgress()
        .width(32)
        .height(32)
        .color(Colors.PRIMARY)
    }
    .width('100%')
    .layoutWeight(1)
    .justifyContent(FlexAlign.Center)
  }

  // 空状态
  buildEmpty() {
    Empty({
      description: '暂无工单',
      actionText: '新建工单'
    })
    .onAction(() => {
      router.pushUrl({ url: '/pages/after-sales/TicketCreate' })
    })
  }

  // 工单列表
  buildList() {
    List() {
      ForEach(this.tickets, (ticket: Ticket) => {
        ListItem() {
          this.buildTicketItem(ticket)
        }
        .padding({ left: 16, right: 16, top: 12 })
      })
    }
    .layoutWeight(1)
    .backgroundColor(Colors.BG_PAGE)
  }

  // 工单项
  buildTicketItem(ticket: Ticket) {
    Column() {
      Row() {
        Text(ticket.ticketNo)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor(Colors.TEXT_PRIMARY)

        Blank()

        // 状态标签
        Text(this.getStatusText(ticket.status))
          .fontSize(12)
          .fontColor(Colors.SUCCESS)
          .padding({ left: 8, right: 8, top: 4, bottom: 4 })
          .backgroundColor(Colors.SUCCESS_LIGHT)
          .borderRadius(4)
      }
      .width('100%')
      .margin({ bottom: 8 })

      Row() {
        Column() {
          Text(ticket.customerName)
            .fontSize(14)
            .fontColor(Colors.TEXT_SECONDARY)

          Text(ticket.productName)
            .fontSize(12)
            .fontColor(Colors.TEXT_PLACEHOLDER)
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.Start)

        Blank()

        Column() {
          Text(ticket.technicianName || '未分配')
            .fontSize(12)
            .fontColor(Colors.TEXT_SECONDARY)

          Text(ticket.createdAt.slice(0, 16))
            .fontSize(12)
            .fontColor(Colors.TEXT_PLACEHOLDER)
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.End)
      }
      .width('100%')
    }
    .width('100%')
    .padding(12)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(8)
    .onClick(() => {
      router.pushUrl({ url: `/pages/after-sales/TicketDetail?id=${ticket.id}` })
    })
  }

  private getStatusText(status: string): string {
    const map: Record<string, string> = {
      'pending': '待受理',
      'accepted': '已受理',
      'assigned': '已分配',
      'processing': '处理中',
      'completed': '已完成',
      'closed': '已关闭'
    }
    return map[status] || status
  }
}
