/**
 * 我的工单页 - 售后人员接单
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { router } from '@kit.ArkRouter'
import { promptAction } from '@kit.ArkUI'
import { apiService } from '../../common/services/ApiService'
import { Colors } from '../../common/constants/Colors'
import { Styles } from '../../common/constants/Styles'

// 工单数据
interface Ticket {
  id: string
  ticketNo: string
  type: string
  status: string
  priority: string
  customerName: string
  customerPhone: string
  productName: string
  serviceAddress: string
  createdAt: string
  assignedAt?: string
}

@Entry
@Component
struct MyTickets {
  @State tickets: Ticket[] = []
  @State loading: boolean = false
  @State filterTab: string = 'pending'

  aboutToAppear() {
    this.loadMyTickets()
  }

  async loadMyTickets() {
    this.loading = true
    try {
      // TODO: 调用实际 API
      // const data = await apiService.get<Ticket[]>('/after-sales/tickets/my')
      
      // 模拟数据
      this.tickets = [
        {
          id: '1',
          ticketNo: 'GD-20260312-001',
          type: 'repair',
          status: 'assigned',
          priority: 'urgent',
          customerName: '张三',
          customerPhone: '138****1234',
          productName: '产品 A',
          serviceAddress: '成都市高新区某某大厦',
          createdAt: '2026-03-12 10:30:00',
          assignedAt: '2026-03-12 14:00:00'
        },
        {
          id: '2',
          ticketNo: 'GD-20260312-002',
          type: 'installation',
          status: 'processing',
          priority: 'normal',
          customerName: '李四',
          customerPhone: '139****5678',
          productName: '产品 B',
          serviceAddress: '重庆市九龙坡区某某路',
          createdAt: '2026-03-12 11:00:00',
          assignedAt: '2026-03-12 15:00:00'
        }
      ]
    } catch (error) {
      console.error('Load my tickets error:', error)
    } finally {
      this.loading = false
    }
  }

  build() {
    Column() {
      // 导航栏
      this.buildNavBar()

      // 筛选 Tab
      this.buildFilterTab()

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

      Text('我的工单')
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .margin({ left: 16 })

      Blank()

      Image($r('app.media.icon_scan'))
        .width(24)
        .height(24)
        .onClick(() => {
          // TODO: 扫码功能
          promptAction.showToast({ message: '扫码功能' })
        })
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
    .backgroundColor(Colors.BG_CARD)
  }

  // 筛选 Tab
  buildFilterTab() {
    Row() {
      this.buildTabItem('pending', '待接单')
      this.buildTabItem('processing', '进行中')
      this.buildTabItem('completed', '已完成')
    }
    .width('100%')
    .height(48)
    .padding({ left: 16, right: 16 })
    .backgroundColor(Colors.BG_CARD)
  }

  // Tab 项
  buildTabItem(key: string, label: string) {
    Column() {
      Text(label)
        .fontSize(Styles.FONT_SIZE.md)
        .fontColor(this.filterTab === key ? Colors.PRIMARY : Colors.TEXT_SECONDARY)
        .fontWeight(this.filterTab === key ? FontWeight.Medium : FontWeight.Regular)

      Rectangle()
        .width(24)
        .height(3)
        .fill(this.filterTab === key ? Colors.PRIMARY : 'transparent')
        .margin({ top: 4 })
    }
    .layoutWeight(1)
    .justifyContent(FlexAlign.Center)
    .onClick(() => {
      this.filterTab = key
      // TODO: 根据筛选加载数据
    })
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
      description: '暂无工单'
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
        Column() {
          Text(ticket.ticketNo)
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .fontColor(Colors.TEXT_PRIMARY)
            .margin({ bottom: 8 })

          Row() {
            Text(this.getTypeText(ticket.type))
              .fontSize(12)
              .fontColor(Colors.PRIMARY)
              .padding({ left: 8, right: 8, top: 4, bottom: 4 })
              .backgroundColor(Colors.PRIMARY_LIGHTER)
              .borderRadius(4)

            Text(this.getPriorityText(ticket.priority))
              .fontSize(12)
              .fontColor(ticket.priority === 'urgent' ? Colors.ERROR : Colors.TEXT_SECONDARY)
              .padding({ left: 8, right: 8, top: 4, bottom: 4 })
              .backgroundColor(ticket.priority === 'urgent' ? Colors.ERROR_LIGHT : Colors.BG_DISABLED)
              .borderRadius(4)
              .margin({ left: 8 })
          }
        }
        .alignItems(HorizontalAlign.Start)

        Blank()
      }
      .width('100%')
      .margin({ bottom: 12 })

      Row() {
        Column() {
          Text(ticket.customerName)
            .fontSize(14)
            .fontColor(Colors.TEXT_PRIMARY)

          Text(ticket.productName)
            .fontSize(12)
            .fontColor(Colors.TEXT_SECONDARY)
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.Start)

        Blank()

        if (ticket.status === 'assigned') {
          Button({
            label: '接单',
            type: 'primary',
            size: 'small'
          })
          .onClick(() => {
            this.acceptTicket(ticket.id)
          })
        } else {
          Button({
            label: '查看',
            type: 'default',
            size: 'small'
          })
          .onClick(() => {
            router.pushUrl({ url: `/pages/after-sales/TicketDetail?id=${ticket.id}` })
          })
        }
      }
      .width('100%')

      // 服务地址
      Row() {
        Image($r('app.media.icon_location'))
          .width(14)
          .height(14)
          .fillColor(Colors.TEXT_PLACEHOLDER)
          .margin({ right: 4 })

        Text(ticket.serviceAddress)
          .fontSize(12)
          .fontColor(Colors.TEXT_PLACEHOLDER)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
      }
      .width('100%')
      .margin({ top: 8 })
    }
    .width('100%')
    .padding(12)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(8)
  }

  // 接单操作
  async acceptTicket(ticketId: string) {
    try {
      // TODO: 调用 API 接单
      // await apiService.post(`/after-sales/tickets/${ticketId}/accept`)
      
      promptAction.showToast({ message: '接单成功' })
      this.loadMyTickets()
    } catch (error) {
      console.error('Accept ticket error:', error)
      promptAction.showToast({ message: '接单失败' })
    }
  }

  private getTypeText(type: string): string {
    const map: Record<string, string> = {
      'repair': '维修',
      'installation': '安装',
      'maintenance': '保养'
    }
    return map[type] || type
  }

  private getPriorityText(priority: string): string {
    const map: Record<string, string> = {
      'normal': '普通',
      'urgent': '紧急',
      'critical': '特急'
    }
    return map[priority] || priority
  }
}
