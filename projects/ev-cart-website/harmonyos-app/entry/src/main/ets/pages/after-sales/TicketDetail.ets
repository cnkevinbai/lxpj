/**
 * 工单详情页
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { router } from '@kit.ArkRouter'
import { promptAction } from '@kit.ArkUI'
import { apiService } from '../../common/services/ApiService'
import { Colors } from '../../common/constants/Colors'
import { Styles } from '../../common/constants/Styles'

// 工单数据
interface TicketDetail {
  id: string
  ticketNo: string
  type: string
  status: string
  priority: string
  customerName: string
  customerPhone: string
  productName: string
  problemDescription: string
  serviceAddress: string
  contactPerson: string
  contactPhone: string
  technicianName: string
  technicianPhone: string
  createdAt: string
  acceptedAt?: string
  assignedAt?: string
  completedAt?: string
  solution?: string
  satisfaction?: number
}

@Entry
@Component
struct TicketDetail {
  @State ticket: TicketDetail | null = null
  @State loading: boolean = false
  @State showCompleteModal: boolean = false
  @State solution: string = ''
  @State serviceFee: string = ''
  @State partsFee: string = ''

  aboutToAppear() {
    this.loadTicket()
  }

  async loadTicket() {
    this.loading = true
    try {
      // TODO: 调用实际 API
      // const data = await apiService.get<TicketDetail>(`/after-sales/tickets/${this.ticketId}`)
      
      // 模拟数据
      this.ticket = {
        id: '1',
        ticketNo: 'GD-20260312-001',
        type: 'repair',
        status: 'processing',
        priority: 'urgent',
        customerName: '张三',
        customerPhone: '138****1234',
        productName: '产品 A',
        problemDescription: '设备无法启动，指示灯不亮',
        serviceAddress: '成都市高新区某某大厦 10 楼',
        contactPerson: '张三',
        contactPhone: '138****1234',
        technicianName: '李师傅',
        technicianPhone: '138****5678',
        createdAt: '2026-03-12 10:30:00',
        acceptedAt: '2026-03-12 11:00:00',
        assignedAt: '2026-03-12 14:00:00'
      }
    } catch (error) {
      console.error('Load ticket error:', error)
      promptAction.showToast({ message: '加载失败' })
    } finally {
      this.loading = false
    }
  }

  build() {
    Column() {
      // 导航栏
      this.buildNavBar()

      // 内容
      if (this.loading) {
        this.buildLoading()
      } else if (this.ticket) {
        Scroll() {
          Column() {
            // 状态卡片
            this.buildStatusCard()

            // 基本信息
            this.buildInfoCard()

            // 客户信息
            this.buildCustomerCard()

            // 服务进度
            this.buildTimeline()

            // 底部操作栏
            this.buildActionBar()
          }
          .width('100%')
          .padding(16)
        }
        .scrollable(ScrollDirection.Vertical)
        .layoutWeight(1)
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

      Text('工单详情')
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .margin({ left: 16 })

      Blank()

      Image($r('app.media.icon_more'))
        .width(24)
        .height(24)
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
    .backgroundColor(Colors.BG_CARD)
  }

  // 状态卡片
  buildStatusCard() {
    Column() {
      Row() {
        Column() {
          Text(this.ticket!.ticketNo)
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor(Colors.TEXT_PRIMARY)
            .margin({ bottom: 8 })

          Row() {
            Text(this.getTypeText(this.ticket!.type))
              .fontSize(12)
              .fontColor(Colors.PRIMARY)
              .padding({ left: 8, right: 8, top: 4, bottom: 4 })
              .backgroundColor(Colors.PRIMARY_LIGHTER)
              .borderRadius(4)

            Text(this.getStatusText(this.ticket!.status))
              .fontSize(12)
              .fontColor(Colors.SUCCESS)
              .padding({ left: 8, right: 8, top: 4, bottom: 4 })
              .backgroundColor(Colors.SUCCESS_LIGHT)
              .borderRadius(4)
              .margin({ left: 8 })

            Text(this.getPriorityText(this.ticket!.priority))
              .fontSize(12)
              .fontColor(Colors.ERROR)
              .padding({ left: 8, right: 8, top: 4, bottom: 4 })
              .backgroundColor(Colors.ERROR_LIGHT)
              .borderRadius(4)
              .margin({ left: 8 })
          }
        }
        .alignItems(HorizontalAlign.Start)

        Blank()
      }
      .width('100%')
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 基本信息
  buildInfoCard() {
    Column() {
      Text('基本信息')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      this.buildInfoRow('产品', this.ticket!.productName)
      this.buildInfoRow('问题', this.ticket!.problemDescription, 3)
      this.buildInfoRow('地址', this.ticket!.serviceAddress, 2)
      this.buildInfoRow('创建时间', this.ticket!.createdAt)
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 客户信息
  buildCustomerCard() {
    Column() {
      Text('客户信息')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      Row() {
        Column() {
          Text(this.ticket!.customerName)
            .fontSize(14)
            .fontColor(Colors.TEXT_PRIMARY)

          Text(this.ticket!.customerPhone)
            .fontSize(12)
            .fontColor(Colors.TEXT_SECONDARY)
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.Start)

        Blank()

        Image($r('app.media.icon_phone'))
          .width(20)
          .height(20)
          .fillColor(Colors.PRIMARY)
          .onClick(() => {
            // TODO: 拨打电话
          })
      }
      .width('100%')
      .margin({ bottom: 12 })

      if (this.ticket!.technicianName) {
        Divider().color(Colors.BORDER_LIGHT).margin({ top: 12, bottom: 12 })

        Row() {
          Column() {
            Text(this.ticket!.technicianName)
              .fontSize(14)
              .fontColor(Colors.TEXT_PRIMARY)

            Text('服务人员')
              .fontSize(12)
              .fontColor(Colors.TEXT_SECONDARY)
              .margin({ top: 4 })
          }
          .alignItems(HorizontalAlign.Start)

          Blank()

          Image($r('app.media.icon_phone'))
            .width(20)
            .height(20)
            .fillColor(Colors.PRIMARY)
        }
        .width('100%')
      }
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 服务进度
  buildTimeline() {
    Column() {
      Text('服务进度')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 16 })

      // 时间线
      Column() {
        this.buildTimelineItem('工单创建', this.ticket!.createdAt, true)
        this.buildTimelineItem('客服受理', this.ticket!.acceptedAt || '', !!this.ticket!.acceptedAt)
        this.buildTimelineItem('已分配', this.ticket!.assignedAt || '', !!this.ticket!.assignedAt, this.ticket!.technicianName)
        this.buildTimelineItem('服务中', '', this.ticket!.status === 'processing', '', true)
        this.buildTimelineItem('已完成', this.ticket!.completedAt || '', !!this.ticket!.completedAt)
      }
      .width('100%')
      .padding({ left: 12 })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 时间线条目
  buildTimelineItem(title: string, time: string, completed: boolean, subtitle?: string, isCurrent?: boolean) {
    Row() {
      // 时间点
      Column() {
        Circle()
          .width(12)
          .height(12)
          .fill(completed ? Colors.PRIMARY : Colors.BORDER_LIGHT)
      }
      .width(24)
      .alignItems(HorizontalAlign.Center)

      // 内容
      Column() {
        Row() {
          Text(title)
            .fontSize(14)
            .fontColor(completed ? Colors.TEXT_PRIMARY : Colors.TEXT_PLACEHOLDER)
            .fontWeight(completed ? FontWeight.Medium : FontWeight.Regular)

          if (isCurrent) {
            Text('当前')
              .fontSize(10)
              .fontColor(Colors.PRIMARY)
              .padding({ left: 4, right: 4, top: 2, bottom: 2 })
              .backgroundColor(Colors.PRIMARY_LIGHTER)
              .borderRadius(4)
              .margin({ left: 8 })
          }
        }

        if (subtitle) {
          Text(subtitle)
            .fontSize(12)
            .fontColor(Colors.TEXT_SECONDARY)
            .margin({ top: 4 })
        }

        if (time) {
          Text(time)
            .fontSize(12)
            .fontColor(Colors.TEXT_PLACEHOLDER)
            .margin({ top: 4 })
        }
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)
      .padding({ left: 12, bottom: 16 })
    }
    .width('100%')
  }

  // 底部操作栏
  buildActionBar() {
    if (this.ticket!.status === 'processing') {
      Row() {
        Button({
          label: '完成工单',
          type: 'primary',
          size: 'large',
          block: true
        })
        .onClick(() => {
          this.showCompleteModal = true
        })

        Button({
          label: '联系客户',
          type: 'default',
          size: 'large'
        })
        .margin({ left: 12 })
        .onClick(() => {
          // TODO: 拨打电话
        })
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Colors.BG_CARD)
      .position({ x: 0, y: 'calc(100% - 80px)' })
    }
  }

  // 信息行
  buildInfoRow(label: string, value: string, lines?: number) {
    Row() {
      Text(label)
        .fontSize(14)
        .fontColor(Colors.TEXT_SECONDARY)
        .width(80)

      Text(value)
        .fontSize(14)
        .fontColor(Colors.TEXT_PRIMARY)
        .layoutWeight(1)
        .maxLines(lines || 1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
    }
    .width('100%')
    .margin({ bottom: 12 })
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

  private getTypeText(type: string): string {
    const map: Record<string, string> = {
      'repair': '维修',
      'installation': '安装',
      'maintenance': '保养'
    }
    return map[type] || type
  }

  private getStatusText(status: string): string {
    const map: Record<string, string> = {
      'pending': '待受理',
      'accepted': '已受理',
      'assigned': '已分配',
      'processing': '处理中',
      'completed': '已完成'
    }
    return map[status] || status
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
