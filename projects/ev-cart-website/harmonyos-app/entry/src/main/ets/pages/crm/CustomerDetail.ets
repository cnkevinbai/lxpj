/**
 * 客户详情页
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { router } from '@kit.ArkRouter'
import { promptAction } from '@kit.ArkUI'
import { Colors } from '../../common/constants/Colors'
import { Styles } from '../../common/constants/Styles'
import { FormatUtils } from '../../common/utils/FormatUtils'

// 客户详情数据
interface CustomerDetail {
  id: string
  name: string
  contactName: string
  contactPhone: string
  contactEmail: string
  level: string
  industry: string
  region: string
  address: string
  status: string
  source: string
  ownerName: string
  createdAt: string
  lastFollowUpAt?: string
  nextFollowUpAt?: string
  remark?: string
}

@Entry
@Component
struct CustomerDetail {
  @State customer: CustomerDetail | null = null
  @State loading: boolean = false

  aboutToAppear() {
    this.loadCustomer()
  }

  async loadCustomer() {
    this.loading = true
    try {
      // TODO: 调用实际 API
      // const data = await apiService.get<CustomerDetail>(`/crm/customers/${this.customerId}`)
      
      // 模拟数据
      this.customer = {
        id: '1',
        name: '某某科技有限公司',
        contactName: '张总',
        contactPhone: '138****1234',
        contactEmail: 'zhang@example.com',
        level: 'A',
        industry: '科技',
        region: '四川成都',
        address: '成都市高新区某某大厦 10 楼',
        status: 'active',
        source: '官网',
        ownerName: '李销售',
        createdAt: '2026-03-01',
        lastFollowUpAt: '2026-03-10',
        nextFollowUpAt: '2026-03-15',
        remark: '重点客户，需要重点跟进'
      }
    } catch (error) {
      console.error('Load customer error:', error)
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
      } else if (this.customer) {
        Scroll() {
          Column() {
            // 客户卡片
            this.buildCustomerCard()

            // 基本信息
            this.buildInfoCard('基本信息', [
              { label: '客户名称', value: this.customer!.name },
              { label: '联系人', value: this.customer!.contactName },
              { label: '联系电话', value: this.customer!.contactPhone },
              { label: '联系邮箱', value: this.customer!.contactEmail },
              { label: '客户等级', value: this.getLevelText(this.customer!.level) },
              { label: '所属行业', value: this.customer!.industry },
              { label: '所在地区', value: this.customer!.region },
              { label: '详细地址', value: this.customer!.address, lines: 2 },
            ])

            // 跟进信息
            this.buildFollowUpCard()

            // 备注信息
            if (this.customer!.remark) {
              this.buildInfoCard('备注', [
                { label: '备注', value: this.customer!.remark, lines: 3 }
              ])
            }
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

      Text('客户详情')
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .margin({ left: 16 })

      Blank()

      Image($r('app.media.icon_edit'))
        .width(24)
        .height(24)
        .margin({ right: 16 })
        .onClick(() => {
          router.pushUrl({ url: `/pages/crm/CustomerEdit?id=${this.customer!.id}` })
        })

      Image($r('app.media.icon_more'))
        .width(24)
        .height(24)
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
    .backgroundColor(Colors.BG_CARD)
  }

  // 客户卡片
  buildCustomerCard() {
    Column() {
      Row() {
        Column() {
          Text(this.customer!.name)
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor(Colors.TEXT_PRIMARY)
            .margin({ bottom: 8 })

          Row() {
            Text(this.getLevelText(this.customer!.level))
              .fontSize(12)
              .fontColor(Colors.SUCCESS)
              .padding({ left: 8, right: 8, top: 4, bottom: 4 })
              .backgroundColor(Colors.SUCCESS_LIGHT)
              .borderRadius(4)

            Text(this.customer!.industry)
              .fontSize(12)
              .fontColor(Colors.TEXT_SECONDARY)
              .padding({ left: 8, right: 8, top: 4, bottom: 4 })
              .backgroundColor(Colors.BG_DISABLED)
              .borderRadius(4)
              .margin({ left: 8 })
          }
        }
        .alignItems(HorizontalAlign.Start)

        Blank()

        // 操作按钮
        Column() {
          Image($r('app.media.icon_phone'))
            .width(32)
            .height(32)
            .fillColor(Colors.PRIMARY)
            .padding(8)
            .backgroundColor(Colors.PRIMARY_LIGHTER)
            .borderRadius(16)
            .onClick(() => {
              // TODO: 拨打电话
              promptAction.showToast({ message: '拨打 ' + this.customer!.contactPhone })
            })

          Image($r('app.media.icon_message'))
            .width(32)
            .height(32)
            .fillColor(Colors.PRIMARY)
            .padding(8)
            .backgroundColor(Colors.PRIMARY_LIGHTER)
            .borderRadius(16)
            .margin({ top: 12 })
            .onClick(() => {
              // TODO: 发送消息
            })
        }
        .alignItems(HorizontalAlign.Center)
      }
      .width('100%')
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 信息卡片
  buildInfoCard(title: string, items: Array<{ label: string, value: string, lines?: number }>) {
    Column() {
      Text(title)
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      ForEach(items, (item: { label: string, value: string, lines?: number }) => {
        Row() {
          Text(item.label)
            .fontSize(14)
            .fontColor(Colors.TEXT_SECONDARY)
            .width(80)

          Text(item.value)
            .fontSize(14)
            .fontColor(Colors.TEXT_PRIMARY)
            .layoutWeight(1)
            .maxLines(item.lines || 1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
        }
        .width('100%')
        .margin({ bottom: 12 })
      })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
  }

  // 跟进信息卡片
  buildFollowUpCard() {
    Column() {
      Text('跟进信息')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Colors.TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 12 })

      Row() {
        Column() {
          Text('上次跟进')
            .fontSize(12)
            .fontColor(Colors.TEXT_SECONDARY)

          Text(this.customer!.lastFollowUpAt || '暂无')
            .fontSize(14)
            .fontColor(Colors.TEXT_PRIMARY)
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.Start)

        Blank()

        Column() {
          Text('下次跟进')
            .fontSize(12)
            .fontColor(Colors.TEXT_SECONDARY)

          Text(this.customer!.nextFollowUpAt || '未安排')
            .fontSize(14)
            .fontColor(Colors.PRIMARY)
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.End)
      }
      .width('100%')

      Button({ label: '添加跟进', type: 'primary', size: 'medium', block: true })
        .margin({ top: 16 })
        .onClick(() => {
          router.pushUrl({ url: `/pages/crm/FollowUpCreate?customerId=${this.customer!.id}` })
        })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Colors.BG_CARD)
    .borderRadius(12)
    .margin({ bottom: 16 })
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

  private getLevelText(level: string): string {
    const map: Record<string, string> = {
      'A': 'A 类客户',
      'B': 'B 类客户',
      'C': 'C 类客户'
    }
    return map[level] || level
  }
}
