/**
 * 审批列表页
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { router } from '@kit.ArkRouter'
import { Colors } from '../../common/constants/Colors'
import { Styles } from '../../common/constants/Styles'

// 审批数据
interface Approval {
  id: string
  approvalNo: string
  type: string
  status: string
  applicantName: string
  amount: number
  createdAt: string
}

@Entry
@Component
struct ApprovalList {
  @State approvals: Approval[] = []
  @State loading: boolean = false
  @State filterTab: string = 'pending'

  aboutToAppear() {
    this.loadApprovals()
  }

  async loadApprovals() {
    this.loading = true
    try {
      // TODO: 调用实际 API
      // const data = await apiService.get<Approval[]>('/approval-flows/records/pending')
      
      // 模拟数据
      this.approvals = [
        {
          id: '1',
          approvalNo: 'SP-20260312-001',
          type: 'purchase',
          status: 'pending',
          applicantName: '张三',
          amount: 125000,
          createdAt: '2026-03-12 10:30:00'
        },
        {
          id: '2',
          approvalNo: 'SP-20260312-002',
          type: 'contract',
          status: 'pending',
          applicantName: '李四',
          amount: 500000,
          createdAt: '2026-03-12 11:00:00'
        }
      ]
    } catch (error) {
      console.error('Load approvals error:', error)
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

      // 审批列表
      if (this.loading) {
        this.buildLoading()
      } else if (this.approvals.length === 0) {
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

      Text('我的审批')
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .margin({ left: 16 })

      Blank()
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
    .backgroundColor(Colors.BG_CARD)
  }

  // 筛选 Tab
  buildFilterTab() {
    Row() {
      this.buildTabItem('pending', '待我审批')
      this.buildTabItem('approved', '我已审批')
      this.buildTabItem('all', '全部')
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
      description: this.filterTab === 'pending' ? '暂无待审批' : '暂无审批记录'
    })
  }

  // 审批列表
  buildList() {
    List() {
      ForEach(this.approvals, (approval: Approval) => {
        ListItem() {
          this.buildApprovalItem(approval)
        }
        .padding({ left: 16, right: 16, top: 12 })
      })
    }
    .layoutWeight(1)
    .backgroundColor(Colors.BG_PAGE)
  }

  // 审批项
  buildApprovalItem(approval: Approval) {
    Column() {
      Row() {
        Column() {
          Text(approval.approvalNo)
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .fontColor(Colors.TEXT_PRIMARY)

          Text(`${approval.applicantName} 提交`)
            .fontSize(12)
            .fontColor(Colors.TEXT_SECONDARY)
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.Start)

        Blank()

        Column() {
          Text(this.formatCurrency(approval.amount))
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor(Colors.PRIMARY)

          Text('待审批')
            .fontSize(12)
            .fontColor(Colors.WARNING)
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.End)
      }
      .width('100%')
      .margin({ bottom: 12 })

      Row() {
        Button({
          label: '拒绝',
          type: 'default',
          size: 'medium'
        })
        .onClick(() => {
          this.approve(approval.id, false)
        })

        Button({
          label: '通过',
          type: 'primary',
          size: 'medium'
        })
        .margin({ left: 12 })
        .onClick(() => {
          this.approve(approval.id, true)
        })
      }
      .width('100%')
      .justifyContent(FlexAlign.End)
    }
    .width('100%')
    .padding(12)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(8)
    .onClick(() => {
      router.pushUrl({ url: `/pages/approval/ApprovalDetail?id=${approval.id}` })
    })
  }

  // 审批操作
  async approve(approvalId: string, approved: boolean) {
    try {
      // TODO: 调用 API 审批
      // await apiService.post(`/approval-flows/${approvalId}/approve`, { approved })
      
      promptAction.showToast({ message: approved ? '审批通过' : '已拒绝' })
      this.loadApprovals()
    } catch (error) {
      console.error('Approve error:', error)
      promptAction.showToast({ message: '操作失败' })
    }
  }

  private formatCurrency(amount: number): string {
    return `¥${amount.toLocaleString('zh-CN')}`
  }
}
